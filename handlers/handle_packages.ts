/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  nestPackageUrl,
  cacheNestpackage,
  pkgRepo } from "./handle_third_party_package.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { WriteImport, WriteDeps } from "./handle_files.ts";
import { Somebybroken } from "../utils/logs.ts";
import { objectGen, errorsMessage, deps } from "../utils/types.ts";
import { existsSync, readJsonSync } from "../imports/fs.ts";
import { Proxy, needProxy } from "../deps.ts";
import { colors } from "../imports/fmt.ts";
import { denoApidb } from "../utils/db.ts";
import cache from "./handle_cache.ts";

/**
 * create url for std/ or x/ packages depending on version or master branch.
 * @param {string} pkgName - package name.
 * @return {string} url for the package.
 */

async function detectVersion(pkgName: string): Promise<string> {
  const [name, maybeVersion] = pkgName.split("@");
  const versionSuffix = maybeVersion ? `@${maybeVersion}` : "";

  if (STD.includes(name)) {
    return `${URI_STD}${versionSuffix}/${name}/`;
  } else if ((await denoApidb(name)).length) {
    return `${URI_X}${name}${versionSuffix}/mod.ts`;
  }

  throw new Error(
    `\n${colors.red("=>")} ${colors.yellow(
      pkgName
    )} is not a third party module\n${colors.green(
      "install using custom install"
    )}\n`
  ).message;
}

/**
 * get package name to add to import map file
 * @param {string} pkg - package name.
 * @return {string} package name.
 */

async function getNamePkg(pkg: string): Promise<string> {
  let name: string = "";

  // * name for packages with a specific version
  if (pkg.includes("@")) {
    const Facts = pkg.split("@");

    if (STD.includes(Facts[0]) && (await denoApidb(Facts[0])).length) {
      name = Facts[0];
    }

    else if (STD.includes(Facts[0])) {
      name = Facts[0];
    }

    else if ((await denoApidb(Facts[0])).length) {
      name = Facts[0];
    }
  }

  else {

    if (STD.includes(pkg) && (await denoApidb(pkg)).length) {
      name = pkg;
    }

    else if (STD.includes(pkg)) {
      name = pkg;
    }

    else if ((await denoApidb(pkg)).length) {
      name = pkg;
    }
  }

  return name;
}

/**
 * Take the packages and cache them and generate the object for the import_map.json file.
 * @param {string[]} args - list of packages to install.
 * @returns {Promise} returns a promise of a { [ key: string ]: string }
 */

export async function installPackages(args: string[]) {
  // * package to push in import_map.json

  const beforeTime = Date.now();

  if (args[1] === flags.map) {
    for (let index = 2; index < args.length; index++) {
      const name = args[index];
      await cache(name.split("@")[0], await detectVersion(name));

      const url = needProxy(await getNamePkg(name))
        ? Proxy(await getNamePkg(name))
        : await (await detectVersion(name)).includes("mod.ts")
          ? await detectVersion(name)
          : await detectVersion(name) + "mod.ts";


      WriteImport((await getNamePkg(name)), url);
      WriteDeps((await getNamePkg(name)), url);
    }
  }

  // * install packages hosted on nest.land.
  else if (args[1] === flags.nest) {
    for (let index = 2; index < args.length; index++) {

      const [name, version] = args[index].split("@");
      const url = await nestPackageUrl(name, version);

      await cacheNestpackage(url);
      WriteImport(name.toLowerCase(), url);
      WriteDeps(name.toLowerCase(), url);
    }
  }

  // * install from repo using denopkg.com
  else if (args[1] === flags.pkg) {
    const [name, url] = pkgRepo(args[2], args[3]);

    await cacheNestpackage(url);
    WriteImport(name.toLowerCase(), url);
    WriteDeps(name.toLowerCase(), url);
  }

  // * take the packages from the deps.json file and install them.
  else {
    try {
        if (!existsSync("./imports/deps.json")) {
          throw new Error(
            colors.red(
              errorsMessage.depsNotFound
            )).message;
        }
        else {
          const deps = readJsonSync("./imports/deps.json") as deps;
          const allPkg = Object.keys(deps.meta).length;

          if (!allPkg) {
            throw new Error(
              colors.red(
                "The deps.json file has no registered packages"
              )).message;
          }
          else {
            for (const pkg of Object.entries(deps.meta)) {
              await cacheNestpackage(pkg[1]);
              WriteImport(pkg[0], pkg[1]);
            }
          }
        }
    }
    catch (err) {
      throw new Error(
        colors.red(
          err instanceof TypeError
          ? errorsMessage.depsFormat
          : err
        )).message;
    }
  }

  // * show installation time
  const afterTime = Date.now();
  console.clear();
  console.log(
    "time to installation:",
    ((afterTime - beforeTime) / 1000).toString() + "s"
  );

  return true;
}

/**
 * install and cached custom packages
 * @param {string[]} args - get the custom package.
 * @returns {boolean} return installation state
 */

export async function customPackage(...args: string[]) {
  const data = args[1].includes("=")
    ? args[1].split("=")
    : ["Error", "Add a valid package"];

  const custom: objectGen = {};

  custom[data[0].toLowerCase()] = data[1];
  // * cache custom module
  const cache = Deno.run({
    cmd: [
      "deno",
      "install",
      "-f",
      "-n",
      "trex_Cache_Map",
      "--unstable",
      data[1],
    ],
  });

  if (!(await cache.status()).success) {
    cache.close();
    Somebybroken("this package is invalid or the url is invalid");
  }

  // * if import_map exists update it
  if (existsSync("./import_map.json")) {
    try {
      // const data = JSON.parse(getImportMap());
      // const oldPackage = exist_imports(data);

      // createPackage({ ...custom, ...oldPackage }, true);
    }

    catch (_) {
      console.error(
        colors.red("the import_map.json file does not have a valid format.")
      );
    }
  }

  else {
    // * else create package
    // createPackage(custom, true);
  }
  return (await cache.status()).success;
}
