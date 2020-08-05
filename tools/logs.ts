/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getImportMap } from "../handlers/handle_files.ts";
import { Somebybroken } from "../utils/logs.ts";
import { importMap } from "../utils/types.ts";
import { needProxy, Proxy } from "../deps.ts";
import { STD } from "../utils/info.ts";

/**
 * show in console all the deps in the import map
 * @returns {boolean} return process state
 */

export async function showImportDeps(): Promise<boolean> {
  console.log(
    "with the new deno.land registration this feature is deprecated 😥"
  );
  return true;
}

/**
 * show in console the tree dependencies of a module
 * @param {string[]} ...args The Deno arguments pass in the console
 * @returns {boolean} return process state or throw a message with an error
 */

export async function packageTreeInfo(...args: string[]) {
  try {
    const map: importMap = JSON.parse(getImportMap());

    for (const pkg in map?.imports) {
      if (STD.includes(args[1])) {
        const moduleName = args[1] + "/";

        if (moduleName === pkg) {
          const _pkg = needProxy(args[1])
            ? Proxy(args[1])
            : map.imports[pkg] + "mod.ts";

          const process = Deno.run({
            cmd: ["deno", "info", "--unstable", _pkg],
          });

          if (!(await process.status()).success) {
            process.close();
            Somebybroken("package information could not be obtained");
          }
          return (await process.status()).success;
        }
      }

      else {
        const moduleName = args[1];

        if (moduleName === pkg) {
          const process = Deno.run({
            cmd: ["deno", "info", map.imports[pkg]],
          });

          if (!(await process.status()).success) {
            process.close();
            Somebybroken("package information could not be obtained");
          }
          return (await process.status()).success;
        }
      }
    }
  } catch (_) {
    throw new Error("the import_map.json file does not have a valid format")
      .message;
  }
}
