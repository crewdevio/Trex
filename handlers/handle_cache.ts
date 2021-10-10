/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResolveDenoPath } from "../commands/run.ts";
import { ErrorInstalling } from "../utils/logs.ts";
import { LoadingSpinner } from "../tools/logs.ts";
import { denoApidb } from "../utils/db.ts";
import { needProxy, Proxy } from "proxy";
import { createHash } from "hash/mod.ts";
import * as colors from "fmt/colors.ts";
import { STD } from "../utils/info.ts";
import { exists } from "fs/mod.ts";

const { red, yellow, green, bold } = colors;

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
  } // * for any linux distro
  else if (Deno.build.os === "linux") {
    return `${user}/.cache/deno/deps/${protocol}/${hostname}/${hash}`;
  } // * for macOs deno cache deps path
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
        "this is not a valid package url, only http or https urls are allowed",
      ),
    ).message;
  } // * get file path
  else {
    const { hostname, protocol, pathname, search } = new URL(packageUrl);
    const toHash = createHash("sha256")
      .update(`${pathname}${search ? `?${search}` : ""}`)
      .toString();
    const filePath = getCachePath(protocol, hostname, toHash);

    return {
      exist: await (exists(filePath) || exists(`${filePath}.metadata.json`)),
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
export async function cached(pkgName: string, pkgUrl: string, show = true) {
  let process: Deno.Process;

  const { hostname } = new URL(pkgUrl);

  const loading = LoadingSpinner(
    green(
      ` Installing ${bold(yellow(pkgName))} from ${bold(yellow(hostname))}`,
    ),
    show,
  );
  const CMD = [ResolveDenoPath(), "cache", "-q", "--unstable"];

  const target = needProxy(pkgName)
    ? Proxy(pkgName)
    : `${
      pkgUrl.startsWith("https://deno.land/std") ? `${pkgUrl}mod.ts` : pkgUrl
    }`;

  if (STD.includes(pkgName) && (await denoApidb(pkgName)).length) {
    process = Deno.run({
      cmd: [...CMD, target],
      stdout: "null",
      stdin: "null",
    });

    if (!(await process.status()).success) {
      loading?.stop();
      process.close();
      ErrorInstalling();
      return;
    }

    process.close();
    loading?.stop();
  } // * install standard package by default use mod.ts
  else if (STD.includes(pkgName)) {
    process = Deno.run({
      cmd: [...CMD, target],
    });

    if (!(await process.status()).success) {
      loading?.stop();
      process.close();
      ErrorInstalling();
      return;
    }

    process.close();
    loading?.stop();
  } // * install third party package
  else if ((await denoApidb(pkgName)).length) {
    process = Deno.run({
      cmd: [...CMD, pkgUrl],
    });

    // * if cannot download package, throw error message
    if (!(await process.status()).success) {
      process.close();
      ErrorInstalling();
    }

    process.close();
    loading?.stop();
  } // * log error if package is not found
  else if (!STD.includes(pkgName) && !(await denoApidb(pkgName)).length) {
    throw new Error(red("package not found.")).message;
  }

  loading?.stop();
}

export default cached;
