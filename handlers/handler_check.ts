/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { yellow, cyan, red, green, bold } from "fmt/colors.ts";
import { getImportMap } from "../handlers/handle_files.ts";
import { CommandNotFound } from "../utils/logs.ts";
import type { importMap } from "../utils/types.ts";
import { flags, keyWords } from "../utils/info.ts";

interface ToUpdate {
  pkg: string;
  latest: string;
  current: string | undefined;
  isVersioned: boolean;
  name: string;
  std: boolean;
  x: boolean;
}

/**
 * check if exist an update for a /std/ or /x/ lib on deno.land
 */
export async function checkDepsUpdates(): Promise<void> {
  const map: importMap = (await getImportMap<importMap>())!;
  const Args = Deno.args;

  if (Args[1]) {
    CommandNotFound({
      commands: [keyWords.check],
      flags: [...flags.fix, ...flags.help],
    });
  }

  const toUpdate: ToUpdate[] = [];

  for (const key in map?.imports) {
    const pkg = map.imports[key];

    if (isDenoLand(pkg)) {
      const { pathname } = toURL(pkg);

      if (pathname.startsWith("/std")) {
        const [, version, name] = pathname.split("/");
        const moduleVersion = version.replace("std@", "")?.trim();

        const latest = await stdLatest();

        if (latest !== moduleVersion) {
          toUpdate.push({
            pkg,
            latest,
            current: moduleVersion,
            isVersioned: moduleVersion !== "std",
            name,
            std: true,
            x: false,
          });
        }
      } else if (pathname.startsWith("/x/")) {
        const [, , module] = pathname.split("/");
        const [name, version] = module.split("@");

        const latest = (await getAllVersion(name))?.trim();
        const current = version?.trim();

        if (latest !== current) {
          toUpdate.push({
            pkg,
            latest,
            current,
            isVersioned: !!current,
            name,
            std: false,
            x: true,
          });
        }
      }
    }
  }

  if (toUpdate.length === 0) {
    console.log(green("\nall dependencies are up to date."));
  }

  for (const { isVersioned, name, pkg, latest, current, std, x } of toUpdate) {
    if (std)
      console.log(cyan(`this is a ${bold(yellow("deno.land/std"))} package:`));

    if (x)
      console.log(cyan(`this is a ${bold(yellow("deno.land/x"))} package:`));

    if (!isVersioned) {
      console.log(
        green(
          `\n${yellow(`warning:`)} the package ${yellow(
            `"${name}"`
          )} is a unversioned url => ${yellow(`(${pkg})`)}\n`
        )
      );

      console.log(green(`The latest version is ${cyan(`${latest}`)}\n`));
      console.log(
        green(`${yellow("[quick fix]")}: trex i -m ${name}@${latest}`)
      );

      console.log(red(`------------------------------------------------`));
    } else {
      console.log(
        green(
          `\nThe package ${yellow(`"${name}"`)} is outdate: current = ${cyan(
            `${current};`
          )} latest = ${cyan(`${latest};`)}\n`
        )
      );

      console.log(
        green(`${yellow("[quick fix]")}: trex i -m ${name}@${latest}`)
      );
      console.log(red(`------------------------------------------------`));
    }
  }
}

async function stdLatest() {
  const response = await fetch(
    "https://api.github.com/repos/denoland/deno_std/releases/latest"
  );
  const { name = "" } = await response.json();

  return (name as string)?.trim();
}

const toURL = (url: string) => new URL(url);

const version = (module: string) =>
  `https://cdn.deno.land/${module}/meta/versions.json`;

async function getAllVersion(module: string): Promise<string> {
  const response = await fetch(version(module));
  const { latest } = await response.json();

  return latest as string;
}

function isDenoLand(url: string) {
  const { hostname } = toURL(url);

  return hostname === "deno.land";
}
