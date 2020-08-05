/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * if a package has a version it returns only the name.
 * @param {string} pkgName - package name.
 * @return {string} package name.
 */

export function haveVersion(pkgName: string) {
  const [name, _] = pkgName.split("@");
  if (pkgName.includes("@")) {
    return name;
  } else {
    return pkgName;
  }
}
