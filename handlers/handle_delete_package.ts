/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { red, green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { STD } from "../utils/info.ts";

const { env, removeSync, build } = Deno;

/**
 * if a package has a version it returns only the name.
 * @param {string} pkgName - package name.
 * @return {string} package name.
 */

export function haveVersion(pkgName: string) {
  const [name, _] = pkgName.split("@");
  if (pkgName.includes("@")) {
    return name;
  }

  else {
    return pkgName;
  }
}

/**
 * return the package along with its version.
 * @param {string} pkgName - package name.
 * @return {string} package name with the version.
 */

function Version(pkgName: string) {

  const [_, version] = pkgName.split("@");

  return pkgName.includes("@") ? "@" + version : "";
}


/**
 * return module name only.
 * @param {string} pkgName - package name.
 * @return {string} package name.
 */

function Name(pkgName: string) {

  const [name, _] = pkgName.split("@");

  return pkgName.includes("@") ? name : pkgName;
}

/**
 * verify that the package exists in the cache.
 * @param {string} home - operating system type name.
 * @param {string} pkgName - package name.
 * @return {boolean} boolean
 */

function existModule(home: string, pkgName: string) {
  if (Deno.build.os === "windows") {
    // * for std modules
    if (STD.includes(haveVersion(pkgName))) {
      return undefined;
    }

    // * deno.land/x modules
    else {
      return existsSync(
        `C:/Users/${home}/AppData/Local/deno/gen/https/deno.land/x/${pkgName}`
      );
    }
  }

  else {
    // * for std modules
    if (STD.includes(haveVersion(pkgName))) {
      return undefined;
    }

    // * deno.land/x modules
    else {
      return existsSync(`${home}/.cache/deno/gen/https/deno.land/x/${pkgName}`);
    }
  }
}

/**
 * returns the package path to remove it.
 * @param {string} home - operating system type name.
 * @param {string} pkgName - package name.
 * @return {string} package path.
 */


export function getPath(home: string, pkgName: string) {

  // * for windows based
  if (Deno.build.os === "windows") {

    if (STD.includes(haveVersion(pkgName))) {
      return `C:/Users/${home}/AppData/Local/deno/gen/https/deno.land/std${Version(
        pkgName
      )}/${Name(pkgName)}`;
    }

    else {
      return `C:/Users/${home}/AppData/Local/deno/gen/https/deno.land/x/${pkgName}`;
    }
  }

  // * for unix based
  else {

    if (STD.includes(haveVersion(pkgName))) {
      return `${home}/.cache/deno/gen/https/deno.land/std${Version(
        pkgName
      )}/${Name(pkgName)}`;
    }

    else {
      return `${home}/.cache/deno/gen/https/deno.land/x/${pkgName}`;
    }
  }
}

/**
 * check if a package can be removed from cache and return the package path.
 * @param {string} pkgName - package name.
 * @returns {string} package path or false.
 */

export function canDelete(pkgName: string) {
  const user = (build.os === "windows"
    ? env.get("USERNAME")
    : env.get("HOME")) as string;

  if (existModule(user, pkgName)) {

    return getPath(user, pkgName);
  }

  else {
    console.error(
      red(
        "it was not removed from the cache because it is a standard module or it's not from deno.land/x or it is not installed."
      )
    );
    return false;
  }
}

/**
 * remove a package from the cache.
 * @param {string} pkgName - package name.
 * @returns {void} void.
 */

export function DeleteCacheModule(pkgName: string) {
  try {
    if (canDelete(pkgName)) {
      const path = canDelete(pkgName) as string;
      removeSync(path, { recursive: true });
      console.log(green(yellow(pkgName + ":") + " deleted from cache."));
    }
  }
  catch (error) {
    throw new Error(red(error)).message;
  }
}
