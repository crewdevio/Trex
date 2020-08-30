/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  nestPackageUrl,
  cachePackage,
  pkgRepo,
} from "./handle_third_party_package.ts";
import {
  WriteImport,
  WriteDeps,
  createFolder,
  validateHash
} from "./handle_files.ts";
import { showPackageList } from "../tools/show_package_list.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { exists, readJson } from "../imports/fs.ts";
import { errorsMessage, deps } from "../utils/types.ts";
import { Proxy, needProxy } from "../imports/proxy.ts";
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
    return `${URI_STD}${versionSuffix}/${name}/mod.ts`;
  }

  else if ((await denoApidb(name)).length) {
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
 * get package name.
 * @param {string} pkg - package name.
 * @return {string} package name.
 */

function getNamePkg(pkg: string): string {
  // * name for packages with a specific version
  if (pkg.includes("@")) {
    const Facts = pkg.split("@");

    return Facts[0];
  } else {
    return pkg;
  }
}

/**
 * create an imports folder with all the dependencies and generate a deps.json file
 * @param {string[]} args - list of packages to install.
 * @returns {Promise} returns a boolean promise.
 */

export async function installPackages(args: string[]) {
  // * package to push in deps.json

  const beforeTime = Date.now();

  if (flags.map.includes(args[1])) {
    for (let index = 2; index < args.length; index++) {
      const name = args[index];
      await cache(name.split("@")[0], await detectVersion(name));

      const url = needProxy(getNamePkg(name))
        ? Proxy(getNamePkg(name))
        : await await detectVersion(name);

      await WriteImport(getNamePkg(name), url);
      await WriteDeps(getNamePkg(name), url);
    }
  }

  // * install packages hosted on nest.land.
  else if (flags.nest.includes(args[1])) {
    for (let index = 2; index < args.length; index++) {
      const [name, version] = args[index].split("@");
      const url = await nestPackageUrl(name, version);

      await cachePackage(url);
      await WriteImport(name.toLowerCase(), url);
      await WriteDeps(name.toLowerCase(), url);
    }
  }

  // * install from repo using denopkg.com
  else if (flags.pkg.includes(args[1])) {
    const [name, url] = pkgRepo(args[2], args[3]);

    await cachePackage(url);
    await WriteImport(name.toLowerCase(), url);
    await WriteDeps(name.toLowerCase(), url);
  }

  // * take the packages from the deps.json file and install them.
  else {
    try {
      if (!(await exists("./imports/deps.json"))) {
        throw new Error(colors.red(errorsMessage.depsNotFound)).message;
      }

      else {
        const deps = await readJson("./imports/deps.json") as deps;
        const allPkg = Object.keys(deps.meta).length;

        if (!allPkg) {
          throw new Error(colors.red(errorsMessage.noPackage)).message;
        }

        else {
          for (const pkg of Object.entries(deps.meta)) {

            // * verify fingerprints are correct
            if (await validateHash(pkg[1].url, pkg[1].hash)) {
              await cachePackage(pkg[1].url);
              await WriteImport(pkg[0], pkg[1].url);
            }

            else {
              throw new Error(
                colors.white(
                  `\nthe generated hash does not match the package "${colors.green(pkg[0])}",\nmaybe you are using an unversioned dependency or the file content or url has been changed.\n\nIf you want to know more information about the hash generation for the packages,\n visit ${colors.red('=>')} ${colors.cyan('https://github.com/crewdevio/Trex/tree/imports')}`
                  )).message;
            }
          }
        }
      }
    }

    catch (err) {
      throw new Error(
        colors.red(err instanceof TypeError ? errorsMessage.depsFormat : err)
      ).message;
    }
  }
  const deps = await readJson("./imports/deps.json") as deps;

  // * show installation time
  const afterTime = Date.now();
  console.clear();
  console.log(
    "time to installation:",
    ((afterTime - beforeTime) / 1000).toString() + "s"
  );
  showPackageList(deps.meta);
  return true;
}

/**
 * install and cached custom packages
 * @param {string[]} args - get the custom package.
 * @returns {boolean} return installation state
 */

export async function customPackage(...args: string[]) {

  const beforeTime = Date.now();
  if (!(await exists("./imports"))) {
    await createFolder();
  }

  try {
    const [name, url] = args[1].split("=");

    await cachePackage(url);
    await WriteImport(name, url);
    await WriteDeps(name, url);
  }

  catch (_) {
    throw new Error(
      colors.red(
        errorsMessage.installationError
        )).message;
  }
  const deps = await readJson("./imports/deps.json") as deps;

  const afterTime = Date.now();
  console.clear();
  console.log(
    "time to installation:",
    ((afterTime - beforeTime) / 1000).toString() + "s"
  );
  showPackageList(deps.meta);
  return true;
}
