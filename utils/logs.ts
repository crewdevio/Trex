/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CommandNotFoundParams, HelpCommandParams } from "./types.ts";
import { didYouMean } from "../tools/did_you_mean.ts";
import { helpsInfo, VERSION } from "./info.ts";
import exec from "../tools/install_tools.ts";
import * as colors from "fmt/colors.ts";

const { cyan, red, green, yellow } = colors;

/**
 * print trex version
 * @param {string} version
 */
export function Version(version: string) {
  console.log(
    `${colors.green("trex:")}\n ${colors.yellow(version)} \n${colors.green(
      "Deno:"
    )}\n ${colors.yellow(`v${Deno.version.deno}`)}`
  );
}

/**
 * show help info
 * @param helpsInfo
 */
export function LogHelp(helpsInfo: string[]) {
  console.log(helpsInfo.join(""));
}

/**
 * update trex
 */
export async function updateTrex(): Promise<void> {
  // * get the version of the repo in github
  const response = (await fetch(
    "https://api.github.com/repos/crewdevio/Trex/releases/latest"
  ).catch((_) => offLine())) as Response;

  // * get the latest release
  const repoVersion = (await response.json()) as { tag_name: string };

  const isCanary = Deno.args[1] === "--canary";
  const canaryURL = "https://denopkg.com/crewdevio/trex@dev";
  const standarURL = `https://deno.land/x/trex@${repoVersion.tag_name}`;
  // check if is a canary update
  const url = isCanary ? canaryURL : standarURL;

  if (repoVersion.tag_name !== VERSION.VERSION || isCanary) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: [
            "-A",
            "-r",
            "--no-check",
            "--import-map",
            `${url}/import_map.json`,
            "--unstable",
            "-n",
            "trex",
          ],
          url: `${url}/cli.ts`,
        },
      });

      console.log(
        cyan(`trex ${green(repoVersion.tag_name)} is now installed.`)
      );
    }, 1000);
  } else {
    console.log(cyan(`you have the last version trex ${repoVersion.tag_name}`));
  }
}

/**
 * show off line message
 */
export function offLine() {
  throw new Error(
    red(
      "something went wrong when making the request, maybe you're offline, check your connection."
    )
  ).message;
}

/**
 * show error message
 * @param {string} message
 */
export function Somebybroken(message: string = "some process is broken.") {
  throw new Error(red(message)).message;
}

/**
 * show install error message
 */
export function ErrorInstalling() {
  const logError = `${red("something went wrong\n")}${green(
    "maybe this package is missing a mod.ts file, use custom install.\n"
  )}${yellow("trex --custom module=moduleUrl\n")}`;

  throw new Error(logError).message;
}

export function HelpCommand({ command, flags }: HelpCommandParams) {
  console.log(
    green(`${red("action: ")} ${command.description}\n`),

    yellow("\nuse:\n"),

    green(
      `trex [${command.alias.map((cmd) => yellow(cmd))}]  ${flags.map((flag) =>
        `[${flag.alias.map((name) => yellow(name))}]`.replace(",", ", ")
      )}\n`.replace(",", " or ")
    ),

    yellow(flags.length ? "\nflags:\n" : ""),

    green(
      `${flags.map(
        (flag) =>
          ` ${red("*")} [${flag.alias.map((sub) => yellow(sub))}] : ${
            flag.description
          }\n`
      )}`.replaceAll(",", " ")
    )
  );
}

export function CommandNotFound({ commands, flags }: CommandNotFoundParams) {
  const { args } = Deno;

  const [command = "", flag = ""] = args;

  if (!args.length) {
    LogHelp(helpsInfo);
    Deno.exit(0);
  }

  if (!commands.includes(command)) {
    console.log(
      red("Command not found:\n"),

      green(
        `\n${red("trex")} ${yellow(
          command ?? "empty command"
        )}: unknown command\n`
      ),

      green(
        `\nuse ${red("trex")} ${yellow("--help")} to see available commands\n`
      )
    );

    console.log(didYouMean(command, commands));

    Deno.exit(0);
  }

  if (!flags.includes(flag)) {
    console.log(
      red("Command flag not found:\n"),

      green(
        `\n${red("trex")} ${yellow(command ?? "empty command")}  ${yellow(
          flag
        )}: unknown command flag\n`
      ),

      green(
        `\nuse ${red("trex")} ${yellow(command ?? "empty command")} ${yellow(
          "--help"
        )} to see available command flags\n`
      )
    );

    console.log(didYouMean(flag, flags, command));

    Deno.exit(0);
  }
}

/**
 * log packages list
 * @param map
 */
export function LogPackages(map: Object, message = true) {
  console.group("Package list: ");
  for (const pkg in map) {
    console.log("|- ", cyan(pkg));
  }
  console.groupEnd();

  if (message) {
    console.log(green("Happy Coding"));
  }
  console.log();
}
