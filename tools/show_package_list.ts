/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors } from "../imports/fmt.ts";

type list = { [key: string]: { url: string; hash: string } };

export function showPackageList(map: list) {
  console.group("Package list: ");
  for (const pkg in map) {
    console.log("|- ", colors.cyan(pkg));
  }
  console.groupEnd();
  console.log(colors.green("Happy Coding"));
}
