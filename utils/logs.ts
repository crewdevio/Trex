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

const { cyan, red, green, yellow } = colors;

export function Version(version: string) {
  console.log(
    `${colors.green("trex:")}\n ${colors.yellow(
      version
    )} \n${colors.green("Deno:")}\n ${colors.yellow("v" + Deno.version.deno)}`
  );
}

export function LogHelp(helpsInfo: string[]) {
  for (const info of helpsInfo) {
    console.log(info);
  }
}

export async function updateTrex(): Promise<void> {
  // * get the version of the repo in github
  const response = await fetch(
    "https://api.github.com/repos/crewdevio/Trex/releases/latest"
  ).catch(err => offLine()) as Response;

  // * get the latest release
  const repoVersion = (await response.json()) as { tag_name: string };

  if ((repoVersion.tag_name !== VERSION.VERSION)) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: ["-A", "--unstable", "-n", "trex"],
          url: "https://deno.land/x/trex/cli.ts",
        },
      });
      console.log(repoVersion.tag_name);
    }, 1000);
  }
  else {
    console.log(cyan("trex is already up to date"));
  }
}

export function offLine() {
  throw new Error(
    red(
      "something went wrong when making the request, maybe you're offline, check your connection."
    )
  ).message;
}

export function Somebybroken(message: string = "some process is broken.") {
  throw new Error(red(message)).message;
}

export function ErrorInstalling() {
  const logError = `${red("something went wrong\n")}${green(
    "maybe this package is missing a mod.ts file, use custom install.\n"
  )}${yellow("trex --custom module=moduleUrl\n")}`;

  throw new Error(logError).message;
}
