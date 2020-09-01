/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { nestPackageUrl, cacheNestpackage, pkgRepo } from "./handle_third_party_package.ts";
import { getImportMap, createPackage } from "./handle_files.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { importMap, objectGen } from "../utils/types.ts";
import { Somebybroken } from "../utils/logs.ts";
import { existsSync } from "../imports/fs.ts";
import { denoApidb } from "../utils/db.ts";
import { colors } from "../imports/fmt.ts";
import cache from "./handle_cache.ts";

const { yellow, red, green } = colors
/**
 * verify that the imports key exists in the import map file.
 * @param {object} map - the import map json object.
 * @returns {object} return object
 */

export function exist_imports(map: importMap) {
  if (map?.imports) {
    // * if exist in import_map the key import return all modules
    return map.imports;
  }

  throw new Error(
    red("the import map.json file does not have the imports key")
  ).message;
}

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
    `\n${red("=>")} ${yellow(
      pkgName
    )} is not a third party module\n${green(
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
      name = Facts[0] + "/";
    }

    else if (STD.includes(Facts[0])) {
      name = Facts[0] + "/";
    }

    else if ((await denoApidb(Facts[0])).length) {
      name = Facts[0];
    }
  }

  else {

    if (STD.includes(pkg) && (await denoApidb(pkg)).length) {
      name = pkg + "/";
    }

    else if (STD.includes(pkg)) {
      name = pkg + "/";
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
  const map: objectGen = {};

  const beforeTime = Date.now();

  if (flags.map.includes(args[1])) {
    for (let index = 2; index < args.length; index++) {
      const url = await detectVersion(args[index]);
      await cache(args[index].split("@")[0], url);
      map[
        (await getNamePkg(args[index])).toLowerCase()
      ] = url;
    }
  }

  // * install packages hosted on nest.land.
  else if (flags.nest.includes(args[1])) {
    for (let index = 2; index < args.length; index++) {

      const [name, version] = args[index].split("@");
      const url = await nestPackageUrl(name, version);

      await cacheNestpackage(url);
      map[name.toLowerCase()] = url;
    }
  }

  // * install from repo using denopkg.com
  else if (flags.pkg.includes(args[1])) {
    const [name, url] = pkgRepo(args[2], args[3]);
    await cacheNestpackage(url);

    map[name.toLowerCase()] = url;
  }

  // * take the packages from the import map file and install them.
  else {
    try {
      const importmap: importMap = JSON.parse(getImportMap());

      for (const pkg in importmap.imports) {
        const md = importmap.imports[pkg];

        if (md.includes("deno.land")) {
          const mod = pkg.split("/").join("");
          await cache(mod, await detectVersion(mod));

          map[
            (await getNamePkg(mod)).toLowerCase()
          ] = await detectVersion(mod);
        }

        else {
          await cacheNestpackage(importmap.imports[pkg]);

          map[pkg.toLowerCase()] = importmap.imports[pkg];
        }
      }
    }

    catch (_) {
      console.error(red("import_map.json file not found"));
    }
  }

  // * show installation time
  const afterTime = Date.now();
  console.clear();
  console.log(
    "time to installation:",
    ((afterTime - beforeTime) / 1000).toString() + "s"
  );

  return map;
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
      const data = JSON.parse(getImportMap());
      const oldPackage = exist_imports(data);

      createPackage({ ...custom, ...oldPackage }, true);
    }

    catch (_) {
      console.error(
        red("the import_map.json file does not have a valid format.")
      );
    }
  }

  else {
    // * else create package
    createPackage(custom, true);
  }
  return (await cache.status()).success;
}
