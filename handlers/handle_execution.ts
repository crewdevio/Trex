/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { moduleUrl, moduleVersions } from "../utils/db.ts";
import { offLine } from "../utils/logs.ts";
import * as colors from "fmt/colors.ts";

interface CliInfo {
  uploaded_at: string;
  directory_listing: Array<{
    path: string;
    size: number;
    type: "dir" | "file";
  }>;
  upload_options: {
    type: "github";
    repository: string;
    ref: string;
  };
}

/**
 * execute a cli tool without install it
 */
export async function execution() {
  let name: string;
  let commands: string[];
  const perms: Set<string> = new Set(["--no-check", "--quiet", "--unstable"]);

  const denoPerms: { [key: string]: string } = {
    A: "-A",
    env: "--allow-env",
    hrtime: "--allow-hrtime",
    net: "--allow-net",
    plugin: "--allow-plugin",
    read: "--allow-read",
    write: "--allow-write",
    run: "--allow-run",
    reload: "--reload",
  };

  const importMaps = [
    "import_map.json",
    "import-map.json",
    "importMap.json",
    "importmap.json",
    "ImportMap.json",
    "Importmap.json",
  ];

  const mainFiles = [
    "cli.ts",
    "cli.js",
    "%name%.ts",
    "%name%.js",
    "main.ts",
    "main.js",
    "mod.ts",
    "mod.js",
    "index.ts",
    "index.js",
  ];

  if (Deno.args.includes("--perms")) {
    let [, , _perms, _name, ..._commands] = Deno.args;
    name = _name;
    commands = _commands;

    const userPerms = _perms.split(",").map((ac) => ac?.trim());

    userPerms.forEach((perm) => {
      if (denoPerms[perm] !== undefined) {
        perms.add(denoPerms[perm]);
      }
    });
  } else {
    const [, _name, ..._comands] = Deno.args;
    name = _name;
    commands = _comands;

    perms.add(denoPerms.A);
  }

  let [cliName = "no_name", cliVersion] = name?.split("@") ?? [];

  if (cliName === "trex") {
    const messages = [
      "catch you! I know what you want to do ;)",
      "hey do you know we can fall into an infinite cycle?",
      "remember, with great power comes great responsibility, use this carefully",
    ].sort(() => 0.5 - Math.random());

    console.log(colors.bgRed(colors.black(`\n ${messages[1]} \n`)));
  }

  if (cliVersion === undefined) {
    const response =
      (await fetch(moduleVersions(cliName)).catch(offLine)) as Response;

    if (!response.ok && response.status > 299) {
      throw new Error(
        `${
          colors.yellow(
            `${
              colors.red(cliName)
            } can't be found in https://deno.land/x/${cliName}`,
          )
        }`,
      ).message;
    }

    const { latest } = (await response.json()) as {
      latest: string;
      versions: string[];
    };

    cliVersion = latest;
  }

  const response =
    (await fetch(moduleUrl(cliName, cliVersion)).catch(offLine)) as Response;
  const { directory_listing } = (await response.json()) as CliInfo;

  let importMapFile: string | null = null;
  let mainFile: string | null = null;

  for (const file of importMaps) {
    const match = directory_listing.some(({ path, type }) =>
      path === `/${file}` && type === "file"
    );

    if (match) {
      importMapFile = file;
      break;
    }
  }

  for (let file of mainFiles) {
    file = file.replace("%name%", cliName);
    const match = directory_listing.some(({ path, type }) =>
      path === `/${file}` && type === "file"
    );

    if (match) {
      mainFile = `https://deno.land/x/${cliName}@${cliVersion}/${file}`;
      break;
    }
  }

  if (importMapFile !== null) {
    perms.add(
      `--import-map=${`https://deno.land/x/${cliName}@${cliVersion}/${importMapFile}`}`,
    );
  }

  if (mainFile === null) {
    throw new Error(
      colors.red(
        `can't find the main file to execute ${colors.yellow(cliName)}`,
      ),
    ).message;
  }

  const cmd = [Deno.execPath(), "run", ...perms, mainFile!, ...commands];

  const process = Deno.run({
    cmd,
    env: Deno.env.toObject(),
  });

  if ((await process.status()).success) {
    Deno.close(process.rid);
  } else {
    Deno.close(process.rid);
    throw new Error(
      colors.red(
        `something went wrong while running ${colors.yellow(cliName)}`,
      ),
    ).message;
  }
}
