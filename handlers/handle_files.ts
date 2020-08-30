/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { writeJson, exists, readJson } from "../imports/fs.ts";
import { deps, errorsMessage } from "../utils/types.ts";
import { createHash } from "../imports/hash.ts";
import { colors } from "../imports/fmt.ts";

const { writeFile, mkdir, create } = Deno;

/**
 * create the imports folder next to the deps.json file
 */
export async function createFolder() {
  await mkdir("imports");
  await create("./imports/deps.json");
  await writeJson("./imports/deps.json", { meta: {} }, { spaces: 2 });
}

/**
 * generates the files with the package exports
 * @param name string
 * @param url string
 */
export async function WriteImport(name: string, url: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`export * from "${url}";`);
  await writeFile(`./imports/${name}.ts`, data);
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

/**
 * write packages inside deps.json file
 * @param name string
 * @param url string
 */
export async function WriteDeps(name: string, url: string) {
  try {
    if (await exists("./imports/deps.json")) {
      const map = (await readJson("./imports/deps.json")) as deps;

      if (!map?.meta) {
        throw new Error(colors.red(errorsMessage.keyNotFound)).message;
      }

      const [old, New] = [
        { ...map?.meta },
        { [name]: { url, hash: await generateHash(url) } },
      ];
      const deps = { ...old, ...New };

      await writeJson("./imports/deps.json", { meta: deps }, { spaces: 2 });
    }

    else {
      const deps = { [name]: { url, hash: await generateHash(url) } };
      await writeJson("./imports/deps.json", { meta: deps }, { spaces: 2 });
    }
  }

  catch (_) {
    throw new Error(colors.red(errorsMessage.depsFormat)).message;
  }
}
