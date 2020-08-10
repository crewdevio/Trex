/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { objectGen } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";

export function showPackageList(map: objectGen) {
  console.group("Package list: ");
  for (const pkg in map) {
    console.log("|- ", colors.cyan(pkg));
  }
  console.groupEnd();
  console.log(colors.green("Happy Coding"));
}
