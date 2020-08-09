/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { writeJsonSync, existsSync, readJson } from "../imports/fs.ts";
import { deps, errorsMessage } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";

const { writeFileSync, mkdir, create } = Deno;

export async function createFolder() {
  await mkdir("imports");
  await create("./imports/deps.json");
  writeJsonSync("./imports/deps.json", { meta: {} }, { spaces: 2 });
}

export function WriteImport(name: string, url: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`export * from "${url}";`);
  writeFileSync(`./imports/${name}.ts`, data);
}

export async function WriteDeps(name: string, url: string) {

  try {
    if (existsSync("./imports/deps.json")) {
      const map = (await readJson("./imports/deps.json")) as deps;

      if (!map?.meta) {
        throw new Error(colors.red(errorsMessage.keyNotFound)).message;
      }
      const deps = { ...map?.meta, ...{ [name]: url } };

      writeJsonSync("./imports/deps.json", { meta: deps }, { spaces: 2 });
    }

    else {
      const deps = { [name]: url };
      writeJsonSync("./imports/deps.json", { meta: deps }, { spaces: 2 });
    }
  }

  catch (_) {
    throw new Error(
      colors.red(
        errorsMessage.depsFormat
      )).message;
  }
}
