/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CommandNotFoundParams, HelpCommandParams } from "./types.ts";
import exec from "../tools/install_tools.ts";
import { colors } from "../imports/fmt.ts";
import { VERSION } from "./info.ts";

export function Version(version: string) {
  console.log(colors.green("version: "), colors.yellow(version));
  console.log(colors.green("Deno: "), colors.yellow(Deno.version.deno));
}

export function LogHelp(helpsInfo: string[]) {
  console.log(helpsInfo.join(""));
}

export async function updateTrex(): Promise<void> {
  // * get the version of the repo in github
  const response = (await fetch(
    "https://denopkg.com/crewdevio/@imports/utils/version.json"
  ).catch(() => offLine())) as Response; // * get the plain text
  const repoVersion = (await response.json()) as { VERSION: string };

  if (repoVersion.VERSION !== VERSION.VERSION) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: ["-r", "-A", "--unstable", "-n", "imports"],
          url: "https://denopkg.com/crewdevio/Trex@imports/cli.ts",
        },
      });
      console.log(repoVersion.VERSION);
    }, 1000);
  } else {
    console.log(colors.cyan(`imports is already up to date`));
  }
}

export function offLine() {
  throw new Error(
    colors.red(
      "something went wrong when making the request, maybe you're offline, check your connection."
    )
  ).message;
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

export function HelpCommand({ command, flags }: HelpCommandParams) {
  console.log(
    colors.green(`${colors.red("action: ")} ${command.description}\n`),

    colors.yellow("\nuse:\n"),

    colors.green(
      `imports [${command.alias.map((cmd) =>
        colors.yellow(cmd)
      )}]  ${flags.map((flag) =>
        `[${flag.alias.map((name) => colors.yellow(name))}]`.replace(",", ", ")
      )}\n`.replace(",", " or ")
    ),

    colors.yellow(flags.length ? "\nflags:\n" : ""),

    colors.green(
      `${flags.map(
        (flag) =>
          ` ${colors.red("*")} [${flag.alias.map((sub) =>
            colors.yellow(sub)
          )}] : ${flag.description}\n`
      )}`.replaceAll(",", " ")
    )
  );
}

export function CommandNotFound({ commands, flags }: CommandNotFoundParams) {
  const { args } = Deno;

  const [command, flag, ..._] = args;

  if (!commands.includes(command)) {
    console.log(
      colors.red("Command not found:\n"),

      colors.green(
        `\n${colors.red("imports")} ${colors.yellow(command ?? "empty command")}: unknown command\n`
      ),

      colors.green(
        `\nuse ${colors.red("imports")} ${colors.yellow(
          "--help"
        )} to see available commands\n`
      )
    );

    throw "";
  }

  if (!flags.includes(flag)) {
    console.log(
      colors.red("Command flag not found:\n"),

      colors.green(
        `\n${colors.red("imports")} ${colors.yellow(command ?? "empty command")}  ${colors.yellow(
          flag
        )}: unknown command flag\n`
      ),

      colors.green(
        `\nuse ${colors.red("imports")} ${colors.yellow(command ?? "empty command")} ${colors.yellow(
          "--help"
        )} to see available command flags\n`
      )
    );

    throw "";
  }
}
