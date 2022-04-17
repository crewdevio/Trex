/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isLocalFile, newVersion } from "../tools/logs.ts";
import { KillProcess } from "../tools/kill_process.ts";
import { writeJson } from "../temp_deps/writeJson.ts";
import type { objectGen } from "../utils/types.ts";
import { createHash } from "../utils/storage.ts";
import { LogPackages } from "../utils/logs.ts";
import { exists } from "../temp_deps/exist.ts";
import { Config } from "./global_configs.ts";
import Store from "./handler_storage.ts";

/**
 * takes the import map file and returns its information.
 * @return {string} string.
 */

export async function getImportMap<T extends any>(): Promise<T | undefined> {
  if (await exists(`./${Config.getConfig("importMap")}`)) {
    const decoder = new TextDecoder("utf-8");

    // * get data from import_map and return data
    const Package = await Deno.readFile(`./${Config.getConfig("importMap")}`);

    return JSON.parse(decoder.decode(Package)) as T;
  }
}

/**
 * sort the packages in the import map file in alphabetical order.
 * @param {object} map - object that contains all the packages.
 * @return {object} the ordered object.
 */

function sortedPackage(map: any): objectGen {
  return Object.keys(map)
    .sort()
    .reduce((result: objectGen, key) => {
      result[key] = map[key];
      return result;
    }, {});
}

/**
 * if the import map file does not exist create it and add the packages.
 * @param {object} map - the object with all the packages.
 * @param {boolean} log - parameter to display a message after installation.
 * @return void
 */

export async function createPackage(map: objectGen, log?: Boolean) {
  // add virtual lock hash
  for (const [pkg, url] of Object.entries(map)) {
    await Store.setItem(`internal__trex__hash:${pkg}`, await generateHash(url));
  }

  // * create import_map.json
  const create = await Deno.create(`./${Config.getConfig("importMap")}`);
  create.close();

  // * write import config inside import_map.json
  await writeJson(
    `./${Config.getConfig("importMap")}`,
    { imports: sortedPackage(map) },
    { spaces: 2 },
  );

  if (log) {
    LogPackages(map);
    // kill opened process
    KillProcess(Deno.resources());
    // show notification if exist a new version avaliable
    await newVersion();
  }
}

/**
 * reads the content of a path either local or remote and returns it in string format
 * @param path string
 */
async function readURLContent(path: string) {
  if (new RegExp("^https?://[a-z.]").test(path)) {
    const data = await fetch(path);
    const text = await data.text();

    return text;
  } else {
    // ignore no external deps
    if (isLocalFile(path)) return "DEFAULT";

    const decoder = new TextDecoder("utf-8");
    const buffer = await Deno.readFile(path);
    return decoder.decode(buffer);
  }
}

/**
 * generates a hash fingerprint based on url and file content
 * @param url string
 */
export async function generateHash(url: string) {
  const hash = await createHash("SHA-256", (await readURLContent(url)) + url);
  return hash;
}

/**
 * verifies that a hash fingerprint is valid
 * @param url string
 * @param hash string
 */
export async function validateHash(url: string, hash: string) {
  const isNew = Object.keys(await Store.getStorage()).some((key) =>
    key.startsWith("internal__trex__hash:")
  );

  if (!isNew) return true;

  const _hash = await createHash("SHA-256", (await readURLContent(url)) + url);

  return _hash.toString() === hash;
}
