/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { needProxy, Proxy } from "../imports/proxy.ts";
import { ErrorInstalling } from "../utils/logs.ts";
import { createHash } from "../imports/hash.ts";
import { colors } from "../imports/fmt.ts";
import { denoApidb } from "../utils/db.ts";
import { exists } from "../imports/fs.ts";
import { STD } from "../utils/info.ts";

const { green, red, yellow } = colors;

// * create a simple delay
export const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time * 1000));

/**
 * get cache deps path
 * @param {string} protocol
 * @param hostname
 * @param {string} hash
 * @returns string
 */

function getCachePath(protocol: string, hostname: string, hash: string) {
  const user = Deno.env.get("USERNAME")! || Deno.env.get("HOME")!;
  protocol = protocol.includes(":") ? protocol.replace(":", "") : protocol;

  if (Deno.build.os === "windows") {
    return `C:\\Users\\${user}\\AppData\\Local\\deno\\deps\\${protocol}\\${hostname}\\${hash}`;
  }
  // * for any linux distro
  else if (Deno.build.os === "linux") {
    return `${user}/.cache/deno/deps/${protocol}/${hostname}/${hash}`;
  }
  // * for macOs deno cache deps path
  else {
    return `${user}/Library/Caches/deno/deps/${protocol}/${hostname}/${hash}`;
  }
}

/**
 * detect if a package is installed
 * @param {string} packageUrl
 */

export async function isCachePackage(packageUrl: string) {
  if (!(packageUrl.includes("http://") || packageUrl.includes("https://"))) {
    throw new Error(
      red(
        "this is not a valid package url, only http or https urls are allowed"
      )
    ).message;
  }
  // * get file path
  else {
    const { hostname, protocol, pathname, search } = new URL(packageUrl);
    const toHash = createHash("sha256")
      .update(`${pathname}${search ? "?" + search : ""}`)
      .toString();
    const filePath = getCachePath(protocol, hostname, toHash);

    return {
      exist: await (exists(filePath) || exists(filePath + ".metadata.json")),
      path: filePath,
    };
  }
}

/**
 * caches packages.
 * @param {string} pkgName - name the package.
 * @param {string} pkgUrl - package url.
 * @return void
 */

async function cached(pkgName: string, pkgUrl: string) {
  const ID = "trex_Cache_Map";
  let process: Deno.Process;

  console.log(green("cache package... \n"));

  if (STD.includes(pkgName) && (await denoApidb(pkgName)).length) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(pkgName) ? Proxy(pkgName) : pkgUrl + "mod.ts",
      ],
    });

    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }
    // TODO(buttercubz) create a better way to handler this
    if (await (await isCachePackage(pkgUrl + "mod.ts")).exist) {
      console.log(
        yellow(`omitted, this version of ${red(pkgName)} is already installed`)
      );
      await delay(0.1);
    } else {
      console.log(green("\n Done. \n"));
    }
  }

  // * install standard package by default use mod.ts
  else if (STD.includes(pkgName)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(pkgName) ? Proxy(pkgName) : pkgUrl + "mod.ts",
      ],
    });

    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }

    if (await (await isCachePackage(pkgUrl + "mod.ts")).exist) {
      console.log(
        yellow(`omitted, this version of ${red(pkgName)} is already installed`)
      );
      await delay(0.1);
    } else {
      console.log(green("\n Done. \n"));
    }
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

    if (await (await isCachePackage(pkgUrl)).exist) {
      console.log(
        yellow(`omitted, this version of ${red(pkgName)} is already installed`)
      );
      await delay(0.1);
    } else {
      console.log(green("\n Done. \n"));
    }
  }

  // * log error if package is not found
  else if (!STD.includes(pkgName) && !(await denoApidb(pkgName)).length) {
    throw new Error(red("package not found.")).message;
  }
}

export default cached;
