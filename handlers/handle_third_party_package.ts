/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ErrorInstalling, offLine } from "../utils/logs.ts";
import type { NestResponse } from "../utils/types.ts";
import { ResolveDenoPath } from "../commands/run.ts";
import { LoadingSpinner } from "../tools/logs.ts";
import { needProxy, Proxy } from "proxy";
import * as colors from "fmt/colors.ts";
import { STD } from "../utils/info.ts";

const { yellow, green, bold } = colors;

/**
 * connects to the nest.land api and returns a url for package installation.
 * @param {string} pkgName - package name.
 * @param {string} version - specific version of the package.
 * @return {string} package url.
 */

export async function nestPackageUrl(
  pkgName: string,
  version: string
): Promise<string> {
  if (STD.includes(pkgName)) {
    return needProxy(pkgName)
      ? Proxy(pkgName)
      : `https://x.nest.land/std@${version}/${pkgName}/mod.ts`;
  } else {
    const response = (await fetch(
      `https://x.nest.land/api/package/${pkgName}/${version}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    ).catch((_) => offLine())) as Response;

    const data: NestResponse = await response.json();

    return `${data.prefix}${data.entry}`;
  }
}

/**
 * download all dependencies and install packages from nest.land.
 * @param {string} url - the url of the package to install.
 * @return {void} void
 */

export async function cacheNestpackage(
  url: string,
  show = true
): Promise<void> {
  const { hostname } = new URL(url);

  const loading = LoadingSpinner(
    green(
      ` Installing ${bold(yellow("package"))} from ${bold(yellow(hostname))}`
    ),
    show
  );

  const process = Deno.run({
    cmd: [ResolveDenoPath(), "cache", "-q", "--unstable", url],
    stdout: "null",
    stdin: "null",
  });

  if (!(await process.status()).success) {
    loading?.stop();
    process.close();
    ErrorInstalling();
    return;
  }

  loading?.stop();
  process.close();
}

/**
 * generates the url for packages that are installed from a repository.
 * @param {string} repoInfo - repository information { user/repo/path_file }
 * @param {string} pkgName - the name of the package to be saved in the import map file, by default use repository name.
 * @return {string} url package.
 */

export function pkgRepo(repoInfo: string, pkgName?: string): string[] {
  const [user, repo, ...path] = repoInfo.split("/");

  return [
    pkgName ? pkgName : repo,
    `https://denopkg.com/${user}/${repo}/${path.join("/")}${
      path.length ? "" : "mod.ts"
    }`,
  ];
}
