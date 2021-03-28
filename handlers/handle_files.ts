/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KillProcess } from "../tools/kill_process.ts";
import { writeJson } from "../temp_deps/writeJson.ts";
import type { objectGen } from "../utils/types.ts";
import { createHash } from "../imports/hash.ts";
import { LogPackages } from "../utils/logs.ts";
import { newVersion } from "../tools/logs.ts";

/**
 * takes the import map file and returns its information.
 * @return {string} string.
 */

export async function getImportMap(): Promise<string>{
  const decoder = new TextDecoder("utf-8");

  // * get data from import_map and return data
  const Package = await Deno.readFile("./import_map.json");

  return decoder.decode(Package);
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
  const hashes: objectGen  = {};

  for (const [pkg, url] of Object.entries(map)) {
    hashes[pkg] = await generateHash(url);
  }

  // * create import_map.json
  const create = await Deno.create("./import_map.json");
  create.close();

  // * write import config inside import_map.json
  await writeJson(
    "./import_map.json",
    { imports: sortedPackage(map), hash: { ...hashes } },
    { spaces: 2 }
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
  }

  else {
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
  const hash = createHash("sha256");
  hash.update(await readURLContent(url) + url);
  return hash.toString();
}

/**
 * verifies that a hash fingerprint is valid
 * @param url string
 * @param hash string
 */
export async function validateHash(url: string, hash: string) {
  const _hash = createHash("sha256");
  _hash.update(await readURLContent(url) + url);
  return _hash.toString() === hash;
}