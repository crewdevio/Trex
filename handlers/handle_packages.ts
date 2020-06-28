import { nestPackageUrl, cacheNestpackage } from '../tools/nest_land_connection.ts';
import { yellow, red, green } from "https://deno.land/std/fmt/colors.ts";
import { checkPackage, createPackage } from "./handle_files.ts";
import { STD, URI_STD, URI_X, flags } from "../utils/info.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
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
 * * get pkg name to create uri
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

  const beforeTime = Date.now();

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

  // * integration on nest.land
  else if (args[1] === flags.nest) {
    for (let index = 2; index < args.length; index++) {

      // ! test on linux and macOs
        const [name, version] = args[index].split("@");
        const packageList = { name, version, url: await  nestPackageUrl(name, version)};

        await cacheNestpackage(packageList.url);
        map[packageList.name.toLowerCase()] = packageList.url;

    }
  }

  // * install all package in import_map.josn
  else {

    try {
      const importmap: importMap = JSON.parse(checkPackage());

      // TODO(buttercubz) add nest.land package install scape.
      for (const pkg in importmap.imports) {

        const mod = pkg.split("/").join("");
        await cache(
          mod,
          detectVersion(mod));

        map[getNamePkg(mod)] = detectVersion(mod);
      }

    }

    catch (_) {
      console.error(red("import_map.json file not found"));
    }
  }

  // * show installation time
  const afterTime = Date.now();
  console.log(
    'time to installation:',
    ((afterTime - beforeTime) / 1000).toString() + "s");

  return map;
}

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
          "Trex_Cache_Map",
          "--unstable",
          data[1]
        ],
  });

  await cache.status();
  // * if import_map exists update it
  if (existsSync("./import_map.json")) {
    const data = JSON.parse(checkPackage());
    const oldPackage = updatePackages(data);

    await createPackage({ ...custom, ...oldPackage }, true);
  } else {
    // * else create package
    await createPackage(custom, true);
  }
  return (await cache.status()).success
}
