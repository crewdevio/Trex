/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { existsSync, readJsonSync, writeJsonSync } from "../imports/fs.ts";
import { errorsMessage } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";
import { deps } from "../utils/types.ts";

/**
 * remove the package from the imports folder and deps.json file
 * @param _arguments string[ ]
 */
export function deletePackage(_arguments: string[]) {
  // * test if exist imports folder
  if (existsSync("./imports/")) {
    try {
      const { removeSync } = Deno;

      if (!existsSync("./imports/deps.json")) {
        throw new Error(colors.red(errorsMessage.depsNotFound)).message;
      }

      const depsFiles = readJsonSync("./imports/deps.json") as deps;

      for (let i = 1; i < _arguments.length; i++) {
        const pkgName = _arguments[i];
        delete depsFiles?.meta[pkgName];
        writeJsonSync("./imports/deps.json", { ...depsFiles }, { spaces: 2 });
        removeSync(`./imports/${pkgName}.ts`, { recursive: true });
      }
    } catch (_) {
      throw new Error(colors.red(errorsMessage.deleteError)).message;
    }
  } else {
    throw new Error(colors.red(errorsMessage.importsFolder)).message;
  }
}
