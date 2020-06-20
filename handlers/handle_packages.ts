import { yellow, red, green } from "https://deno.land/std/fmt/colors.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { importMap, objectGen } from "../utils/types.ts";
import cache from "./handle_cache.ts";
import db from "../utils/db.ts";

export function updatePackages(Package: importMap) {
  if (Package?.imports) {
    // * if exist in import_map the key import return all modules
    return Package.imports;
  } else {
    // * else return error obj
    return {
      error: "imports not found",
      were: "import_map.json",
    };
  }
}

/**
 * * get pkg name create uri
 */

function detectVersion(pkgName: string): string {
  let uri: string = "";

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
        `\n${red("=>")} ${yellow(pkgName)} not is a third party modules\n${
          green("install using custom install")
        }\n`
        ).message;
    }
  }

  return uri;
}

/**
 * * get pkg name and depure by type pkg
 */

function getNamePkg(pkg: string): string {
  let name: string = "";
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

export async function installPakages(args: string[]) {
  // * package to push in import_map.json
  const map: objectGen = {};

  if (args[1] === flags.map) {
    for (let index = 2; index < args.length; index++) {

      // ! test on linux and macOs
        await cache(
          args[index].split("@")[0],
          detectVersion(args[index]),
        );
      map[getNamePkg(args[index])] = detectVersion(args[index]);
    }
  }

  return map;
}
