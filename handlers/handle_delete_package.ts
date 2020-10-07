/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readJson, writeJson } from "../temp_deps/writeJson.ts";
import { errorsMessage } from "../utils/types.ts";
import type { deps } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";
/**
 * remove the package from the imports folder and deps.json file
 * @param _arguments string[ ]
 */
export async function deletePackage(_arguments: string[]) {
  // * test if exist imports folder
  if (await exists("./imports/")) {
    try {
      const { remove } = Deno;

      if (!(await exists("./imports/deps.json"))) {
        throw new Error(colors.red(errorsMessage.depsNotFound)).message;
      }

      const depsFiles = await readJson("./imports/deps.json") as deps;

      for (let i = 1; i < _arguments.length; i++) {
        const pkgName = _arguments[i];
        delete depsFiles?.meta[pkgName];
        await writeJson("./imports/deps.json", { ...depsFiles }, { spaces: 2 });
        await remove(`./imports/${pkgName}.ts`, { recursive: true });
      }
    } catch (_) {
      throw new Error(colors.red(errorsMessage.deleteError)).message;
    }
  } else {
    throw new Error(colors.red(errorsMessage.importsFolder)).message;
  }
}
