/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import exec from "../tools/install_tools.ts";
import { colors } from "../imports/fmt.ts";
import { VERSION } from "./info.ts";

export function Version(version: string) {
  console.log(colors.green("version: "), colors.yellow(version));
  console.log(colors.green("Deno: "), colors.yellow(Deno.version.deno));
}

export function LogHelp(helpsInfo: string[]) {
  for (const info of helpsInfo) {
    console.log(info);
  }
}

export async function updateTrex(name = "imports"): Promise<void> {
  // * get the version of the repo in github
  const response = (await fetch(
    "https://denopkg.com/crewdevio/Trex@imports/utils/version.json"
  ).catch(() => offLine())) as Response; // * get the plain text
  const repoVersion = (await response.json()) as { VERSION: string };

  if (repoVersion.VERSION !== VERSION.VERSION) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: ["-A", "--unstable", "-n", name],
          url: "https://denopkg.com/crewdevio/Trex@imports/cli.ts",
        },
      });
      console.log(repoVersion.VERSION);
    }, 1000);
  } else {
    console.log(colors.cyan(`${name} is already up to date`));
  }
}

export function offLine() {
  throw new Error(
    colors.red(
      "something went wrong when making the request, maybe you're offline, check your connection.")).message;
}

export function Somebybroken(message: string = "some process is broken.") {
  throw new Error(colors.red(message)).message;
}

export function ErrorInstalling() {
  const logError = `${colors.red("something went wrong\n")}${colors.green(
    "maybe this package is missing a mod.ts file, use custom install.\n"
  )}${colors.yellow("--custom module=moduleUrl\n")}`;

  throw new Error(logError).message;
}
