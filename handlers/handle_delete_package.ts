/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { errorsMessage } from "../utils/types.ts";
import { existsSync } from "../imports/fs.ts";
import { colors } from "../imports/fmt.ts";

/**
 * remove the package from the imports folder
 * @param _arguments string[ ]
 */
export function deletePackage(_arguments: string[]) {
  // * test if exist imports folder
  if (existsSync("./imports/")) {
    try {
      const { removeSync } = Deno;

      for (let i = 1; i < _arguments.length; i++) {
        const pkgName = _arguments[i];
        removeSync(`./imports/${pkgName}.ts`, { recursive: true });
      }
    } catch (_) {
      throw new Error(colors.red(errorsMessage.deleteError)).message;
    }
  } else {
    throw new Error(colors.red(errorsMessage.importsFolder)).message;
  }
}
