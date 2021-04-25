/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPackage, getImportMap } from "./handle_files.ts";
import { haveVersion } from "./handle_delete_package.ts";
import { existImports } from "./handle_packages.ts";
import type { importMap } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";
import { STD } from "../utils/info.ts";

const { red } = colors;

/**
 * remove package from import_map.json
 * @param {string} toDelete
 */
export async function deletepackage(toDelete: string) {
  if (await exists("./import_map.json")) {
    try {
      const pkg: string = toDelete.trim();
      const Packages = (await getImportMap<importMap>())!;

      if (Packages.imports) {
        delete Packages.imports[
          STD.includes(haveVersion(pkg))
            ? `${haveVersion(pkg)}/`
            : haveVersion(pkg)
        ];

        delete Packages.hash[
          STD.includes(haveVersion(pkg))
            ? `${haveVersion(pkg)}/`
            : haveVersion(pkg)
        ];

        const newPackage = existImports(Packages);

        await createPackage(newPackage);
        console.clear();
      } else {
        throw new Error(red("'imports' key not found in import_map.json"))
          .message;
      }
    } catch (_) {
      throw new Error(
        red(
          _ instanceof TypeError
            ? "add the name of the package to remove"
            : "the import_map.json file does not have a valid format."
        )
      ).message;
    }
  } else {
    console.error(red("import_map.json"));
    return;
  }
}
