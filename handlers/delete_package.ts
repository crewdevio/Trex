/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createPackage, getImportMap } from "./handle_files.ts";
import { haveVersion } from "./handle_delete_package.ts";
import { existImports } from "./handle_packages.ts";
import type { importMap } from "../utils/types.ts";
import { exists } from "../temp_deps/exist.ts";
import { Config } from "./global_configs.ts";
import Store from "./handler_storage.ts";
import * as colors from "fmt/colors.ts";
import { STD } from "../utils/info.ts";

const { red } = colors;

/**
 * remove package from import_map.json
 * @param {string} toDelete
 */
export async function deletepackage(toDelete: string) {
  if (await exists(`./${Config.getConfig("importMap")}`)) {
    try {
      const pkg: string = toDelete?.trim();
      const Packages = (await getImportMap<importMap>())!;

      if (Packages.imports) {
        const toDelete = STD.includes(haveVersion(pkg))
          ? `${haveVersion(pkg)}/`
          : haveVersion(pkg);

        delete Packages.imports[toDelete];

        // delete virtual lock hash
        await Store.deleteItem(`internal__trex__hash:${toDelete}`);

        const newPackage = existImports(Packages);

        await createPackage(newPackage);
        return console.clear();
      }

      throw new Error(
        red(`'imports' key not found in ${Config.getConfig("importMap")}`),
      ).message;
    } catch (exception) {
      console.log(exception);
      throw new Error(
        red(
          exception instanceof TypeError
            ? "add the name of the package to remove."
            : `the ${
              Config.getConfig(
                "importMap",
              )
            } file does not have a valid format.`,
        ),
      ).message;
    }
  } else {
    console.error(red(Config.getConfig("importMap")));
    return;
  }
}
