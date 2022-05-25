/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  cacheNestpackage,
  nestPackageUrl,
  pkgRepo,
} from "./handle_third_party_package.ts";
import { ResolveDenoPath, Run, Scripts } from "../commands/run.ts";
import { createPackage, getImportMap } from "./handle_files.ts";
import { isLocalFile, LoadingSpinner } from "../tools/logs.ts";
import type { importMap, objectGen } from "../utils/types.ts";
import { flags, STD, URI_STD, URI_X } from "../utils/info.ts";
import { getMainFile } from "../utils/file_resolver.ts";
import { stdLatest, xLatest } from "./handler_check.ts";
import { validateHash } from "./handle_files.ts";
import { Somebybroken } from "../utils/logs.ts";
import { exists } from "exist";
import { Config } from "./global_configs.ts";
import { denoApidb } from "../utils/db.ts";
import Store from "./handler_storage.ts";
import * as colors from "fmt/colors.ts";
import cache from "./handle_cache.ts";

const { yellow, red, green, bold } = colors;
/**
 * verify that the imports key exists in the import map file.
 * @param {object} map - the import map json object.
 * @returns {object} return object
 */

export function existImports(map: importMap): objectGen {
  if (map?.imports) {
    // * if exist in import_map the key import return all modules
    return map.imports;
  }

  throw new Error(
    red(
      `the ${
        Config.getConfig("importMap")
      } file does not have the imports key.`,
    ),
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
    const latest = await stdLatest();

    return `${URI_STD}${
      versionSuffix === "" ? `@${latest ? latest : ""}` : versionSuffix
    }/${name}/`;
  } else if ((await denoApidb(name)).length) {
    const [target, latest] = await Promise.all([
      (await getMainFile(name, maybeVersion)) as { file: string },
      await xLatest(name),
    ]);

    return `${URI_X}${name}${
      versionSuffix === "" ? `@${latest ? latest : ""}` : versionSuffix
    }/${target.file}`;
  }

  throw new Error(
    `\n${red("=>")} ${yellow(pkgName)} is not a third party module\n${
      green(
        "install using custom install",
      )
    }\n`,
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
    const [pkgName] = pkg.split("@");

    if (STD.includes(pkgName) && (await denoApidb(pkgName)).length) {
      name = `${pkgName}/`;
    } else if (STD.includes(pkgName)) {
      name = `${pkgName}/`;
    } else if ((await denoApidb(pkgName)).length) {
      name = pkgName;
    }
  } else {
    if (STD.includes(pkg) && (await denoApidb(pkg)).length) {
      name = `${pkg}/`;
    } else if (STD.includes(pkg)) {
      name = `${pkg}/`;
    } else if ((await denoApidb(pkg)).length) {
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

export async function installPackages(
  args: string[],
  show = true,
): Promise<objectGen> {
  // * package to push in import_map.json
  const map: objectGen = {};

  const beforeTime = Date.now();

  if (flags.map.includes(args[1]) || flags.nest.includes(args[1])) {
    for (let index = 2; index < args.length; index++) {
      // * install packages hosted on deno.land
      if (flags.map.includes(args[1])) {
        const url = await detectVersion(args[index]);
        await cache(args[index].split("@")[0], url, show);
        map[(await getNamePkg(args[index])).toLowerCase()] = url;
      } // * install packages hosted on nest.land.
      else if (flags.nest.includes(args[1])) {
        const [name, version] = args[index].split("@");
        const url = await nestPackageUrl(name, version);

        await cacheNestpackage(url);
        map[name.toLowerCase()] = url;
      }
    }
  } // * install from repo using denopkg.com
  else if (flags.pkg.includes(args[1])) {
    const [name, url] = pkgRepo(args[2], args[3]);
    await cacheNestpackage(url);

    map[name.toLowerCase()] = url;
  } // * take the packages from the import map file and install them.
  else {
    try {
      const importmap = (await getImportMap<importMap>())!;
      const runJson = await Scripts();

      // preinstall hook
      if (runJson?.scripts?.preinstall) await Run("preinstall");

      for (const pkg in importmap?.imports) {
        const url = importmap.imports[pkg];

        // skip packages that are local files
        if (!isLocalFile(url)) {
          // check virtual lock hash
          if (
            await validateHash(
              url,
              await Store.getItem(`internal__trex__hash:${pkg}`),
            )
          ) {
            if (url?.includes("deno.land")) {
              const mod = pkg.split("/").join("");
              await cache(mod, await detectVersion(mod));

              map[(await getNamePkg(mod)).toLowerCase()] = url;
            } else {
              await cacheNestpackage(importmap?.imports[pkg]!);
              map[pkg.toLowerCase()] = importmap?.imports[pkg]!;
            }
          } else {
            console.log(
              colors.white(
                `\nthe generated hash does not match the package "${
                  colors.green(
                    pkg,
                  )
                }",\nmaybe you are using an unversioned dependency or the file content or url has been changed.\n\nIf you want to know more information about the hash generation for the packages,\n visit ${
                  colors.red(
                    "=>",
                  )
                } ${colors.cyan("https://github.com/crewdevio/Trex")}`,
              ),
            );

            Deno.exit(0);
          }
        }
      }
    } catch (_) {
      // show message
      console.log(red(`${Config.getConfig("importMap")} file not found`));
    }
  }

  // * show installation time
  const afterTime = Date.now();
  console.clear();
  console.log(
    "time to installation:",
    ((afterTime - beforeTime) / 1000).toString() + "s",
  );

  return map;
}

/**
 * install and cached custom packages
 * @param {string[]} args - get the custom package.
 * @returns {boolean} return installation state
 */

export async function customPackage(
  args: string[],
  show = true,
): Promise<boolean> {
  const CMD = [ResolveDenoPath(), "cache", "-q", "--unstable"];

  const entry = args[1] ?? "";

  if (!entry.includes("=")) {
    throw new Error(red("Add a valid package")).message;
  }

  const [pkgName, url, ...rest] = args[1].split("=");
  const { hostname } = new URL(url);
  const loading = LoadingSpinner(
    green(
      ` Installing ${bold(yellow(pkgName))} from ${bold(yellow(hostname))}`,
    ),
    show,
  )!;

  const custom: objectGen = {};

  custom[pkgName.toLowerCase()] = rest.length > 0
    ? `${[url, ...rest].join("=")}`
    : url;
  // * cache custom module
  const process = Deno.run({
    cmd: [...CMD, url],
    stdin: "null",
    stdout: "null",
  });

  if (!(await process.status()).success) {
    loading?.stop();
    process.close();
    Somebybroken("this package is invalid or the url is invalid");
    return false;
  }

  // * if import_map exists update it
  if (await exists(`./${Config.getConfig("importMap")}`)) {
    try {
      const data = (await getImportMap<importMap>())!;
      const oldPackage = existImports(data);

      createPackage({ ...oldPackage, ...custom }, true);
    } catch (_) {
      loading?.stop();
      process.close();
      throw new Error(
        red(
          `the ${
            Config.getConfig(
              "importMap",
            )
          } file does not have a valid format.`,
        ),
      ).message;
    }
  } else {
    // * else create package
    createPackage(custom, true);
  }

  // * close main install process
  loading?.stop();
  process.close();
  return true;
}
