/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { deps, errorsMessage } from "../utils/types.ts";
import { readJson } from "../imports/fs.ts";
import { colors } from "../imports/fmt.ts";

/**
 * show in console the tree dependencies of a module
 * @param {string[]} ...args The Deno arguments pass in the console
 * @returns {boolean} return process state or throw a message with an error
 */

export async function packageTreeInfo(_arguments: string[]) {
  try {
    const map = await readJson("./imports/deps.json") as deps;

    if (!map?.meta) {
      throw new Error(colors.red(errorsMessage.keyNotFound)).message;
    }

    const pkgName = _arguments[1];

    const process = Deno.run({
      cmd: ["deno", "info", "--unstable", map?.meta[pkgName].url],
    });

    if (!(await process.status()).success) {
      throw new Error(errorsMessage.processError).name;
    }

    process.close();
  }
  catch (err) {
    throw new Error(
      colors.red(
        err instanceof Deno.errors.NotFound
          ? errorsMessage.depsNotFound
          : typeof err === "string"
            ? err
            :(err as Error).message
      )
    ).message;
  }
}
