/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { nestPackageUrl, cacheNestpackage, pkgRepo } from "./handle_third_party_package.ts";
import { yellow, red, green } from "https://deno.land/std/fmt/colors.ts";
import { getImportMap, createPackage } from "./handle_files.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { importMap, objectGen } from "../utils/types.ts";
import { Somebybroken } from "../utils/logs.ts";
import cache from "./handle_cache.ts";
import db from "../utils/db.ts";


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

function detectVersion(pkgName: string): string {
  let uri: string = "";

  // * url for packages with a specific version
  if (pkgName.includes("@")) {
    const ModuleRelease = pkgName.split("@");

    if (STD.includes(ModuleRelease[0]) && db.includes(ModuleRelease[0])) {
      uri = `${URI_STD}@${ModuleRelease[1]}/${ModuleRelease[0]}/`;
    }

    else if (STD.includes(ModuleRelease[0])) {
      uri = `${URI_STD}@${ModuleRelease[1]}/${ModuleRelease[0]}/`;
    }

    else if (db.includes(ModuleRelease[0])) {
      uri = `${URI_X + ModuleRelease[0]}@${ModuleRelease[1]}/mod.ts`;
    }
  }

  else {

    if (STD.includes(pkgName) && db.includes(pkgName)) {
      uri = `${URI_STD}/${pkgName}/`;
    }

    else if (STD.includes(pkgName)) {
      uri = `${URI_STD}/${pkgName}/`;
    }

    else if (db.includes(pkgName)) {
      uri = `${URI_X}${pkgName}/mod.ts`;
    }

    else if (!STD.includes(pkgName) && !db.includes(pkgName)) {
      throw new Error(
        `\n${red("=>")} ${yellow(
          pkgName
        )} not is a third party modules\n${green(
          "install using custom install"
        )}\n`
      ).message;
    }
  }

  return uri;
}

/**
 * get package name to add to import map file
 * @param {string} pkg - package name.
 * @return {string} package name.
 */

function getNamePkg(pkg: string): string {
  let name: string = "";

  // * name for packages with a specific version
  if (pkg.includes("@")) {
    const Facts = pkg.split("@");

    if (STD.includes(Facts[0]) && db.includes(Facts[0])) {
      name = Facts[0] + "/";
    }

    else if (STD.includes(Facts[0])) {
      name = Facts[0] + "/";
    }

    else if (db.includes(Facts[0])) {
      name = Facts[0];
    }
  }

  else {

    if (STD.includes(pkg) && db.includes(pkg)) {
      name = pkg + "/";
    }

    else if (STD.includes(pkg)) {
      name = pkg + "/";
    }

    else if (db.includes(pkg)) {
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

  if (args[1] === flags.map) {
    for (let index = 2; index < args.length; index++) {

      await cache(args[index].split("@")[0], detectVersion(args[index]));
      map[getNamePkg(args[index]).toLowerCase()] = detectVersion(args[index]);
    }
  }

  // * install packages hosted on nest.land.
  else if (args[1] === flags.nest) {
    for (let index = 2; index < args.length; index++) {

      const [name, version] = args[index].split("@");
      const url = await nestPackageUrl(name, version);

      await cacheNestpackage(url);
      map[name.toLowerCase()] = url;
    }
  }

  // * install from repo using denopkg.com
  else if (args[1] === flags.pkg) {
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
          await cache(mod, detectVersion(mod));

          map[getNamePkg(mod).toLowerCase()] = detectVersion(mod);
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
    Somebybroken();
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
