/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getImportMap } from "../handlers/handle_files.ts";
import { Somebybroken, offLine } from "../utils/logs.ts";
import { ResolveDenoPath } from "../commands/run.ts";
import type { importMap } from "../utils/types.ts";
import { STD, VERSION } from "../utils/info.ts";
import { needProxy, Proxy } from "proxy";
import * as colors from "fmt/colors.ts";
import { ltr, clean } from "semver";
import { wait } from "wait";

const { yellow, cyan, red, white, green } = colors;

/**
 * show in console the tree dependencies of a module
 * @param {string[]} ...args The Deno arguments pass in the console
 * @returns {boolean} return process state or throw a message with an error
 */

export async function packageTreeInfo(
  ...args: string[]
): Promise<boolean | undefined> {
  try {
    const map: importMap = (await getImportMap<importMap>())!;

    for (const pkg in map?.imports) {
      if (STD.includes(args[1])) {
        const moduleName = `${args[1]}/`;

        if (moduleName === pkg) {
          const _pkg = needProxy(args[1])
            ? Proxy(args[1])
            : `${map.imports[pkg]}mod.ts`;

          const process = Deno.run({
            cmd: [ResolveDenoPath(), "info", "--unstable", _pkg],
          });

          if (!(await process.status()).success) {
            process.close();
            Somebybroken("package information could not be obtained");
          }

          const status = (await process.status()).success;

          process.close();
          return status;
        }
      }

      else {
        const moduleName = args[1];

        if (moduleName === pkg) {
          const process = Deno.run({
            cmd: [ResolveDenoPath(), "info", "--unstable", map.imports[pkg]],
          });

          if (!(await process.status()).success) {
            process.close();
            Somebybroken("package information could not be obtained");
          }
          const status = (await process.status()).success;

          process.close();
          return status;
        }
      }
    }
  } catch (_) {
    throw new Error("the import_map.json file does not have a valid format")
      .message;
  }
}

/**
 * send update notification
 */
export async function newVersion(): Promise<void> {
  const response = (await fetch(
    "https://api.github.com/repos/crewdevio/Trex/releases/latest"
  ).catch((_) => offLine())) as Response;

  const data = (await response.json()) as { tag_name: string };

  // check if trex is outdate
  if (data?.tag_name !== VERSION.VERSION && ltr(clean(VERSION.VERSION)!, clean(data?.tag_name)!)) {
    const versionMessage = white(
      `Actual ${red(VERSION.VERSION)} -> new ${cyan(data?.tag_name ?? "?")}`
    );

    const upgradeMessage = white(`use ${green("trex")} upgrade `);

    console.log(
      yellow(`
                   ╭─────────────────────────────────────╮
                   │                                     │
                   │   New version avaliable for trex    │
                   │                                     │
                   │     ${    versionMessage      }     │
                   │                                     │
                   │                                     │
                   │          ${upgradeMessage}          │
                   │                                     │
                   ╰─────────────────────────────────────╯`)
    );
  }
}

/**
 * show a pretty loading instalation message
 * @param {string} text
 */
export function LoadingSpinner(text: string, show = true) {
  if (show) {
    console.clear();
    const spinner = wait({
      spinner: {
        frames: [
          ".    ",
          "..   ",
          "...  ",
          ".... ",
          ".....",
          " ....",
          "  ...",
          "   ..",
          "    .",
        ],
        interval: 50,
      },
      text: "",
    }).start();

    const colors: string[] = [
      "red",
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "white",
    ];

    spinner.color = colors[Math.floor(Math.random() * 6) + 1];
    spinner.text = text;

    return spinner;

  }
}

/**
 * check if a local file.
 * @param {string} url
 * @returns {boolean}
 */
export const isLocalFile = (url: string) => {
  return (
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("/") ||
    url.startsWith("file:") ||
    url.startsWith("C:\\")
  );
};