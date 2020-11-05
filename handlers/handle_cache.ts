/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { needProxy, Proxy } from "../imports/proxy.ts";
import { ErrorInstalling } from "../utils/logs.ts";
import { denoApidb } from "../utils/db.ts";
import { colors } from "../imports/fmt.ts";
import { STD } from "../utils/info.ts";

/**
 * caches packages.
 * @param {string} pkgName - name the package.
 * @param {string} pkgUrl - package url.
 * @return void
 */

async function cached(pkgName: string, pkgUrl: string) {
  const ID = "trex_Cache_Map";
  let process: Deno.Process;

  console.log(colors.green("cache package... \n"));

  if (STD.includes(pkgName) && (await denoApidb(pkgName)).length) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(pkgName) ? Proxy(pkgName) : pkgUrl,
      ],
    });

    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }
  }

  // * install standar party package by defauld use mod.ts
  else if (STD.includes(pkgName)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(pkgName) ? Proxy(pkgName) : pkgUrl,
      ],
    });

    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }

    console.log(colors.green("\n Done. \n"));
  }

  // * install third party package
  else if ((await denoApidb(pkgName)).length) {
    process = Deno.run({
      cmd: ["deno", "install", "-f", "-n", ID, "--unstable", pkgUrl],
    });

    // * if cannot download package, throw error message
    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }

    console.log(colors.green("\n Done. \n"));
  }

  // * log error if package is not found
  else if (!STD.includes(pkgName) && !(await denoApidb(pkgName)).length) {
    throw new Error(colors.red("package not found.")).message;
  }
}

export default cached;
