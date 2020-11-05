/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors } from "../imports/fmt.ts";

export const URI_STD = "https://deno.land/std";

export const URI_X = "https://deno.land/x/";

export const STD = [
  "_util",
  "fs",
  "http",
  "archive",
  "async",
  "bytes",
  "datetime",
  "encoding",
  "flags",
  "fmt",
  "hash",
  "io",
  "log",
  "mime",
  "node",
  "path",
  "permissions",
  "signal",
  "testing",
  "textproto",
  "uuid",
  "ws",
  "wasi",
];

export const VERSION = { VERSION: "v1.3.3-imports" };

export const helpsInfo = [
  colors.green(
    "advanced package management for deno, handling dependencies at any scale\n"
  ),

  colors.green("\nUSAGE:\n"),
  `  imports ${colors.yellow("[OPTIONS]")} ${colors.yellow("[SUBCOMMAND]")}\n`,

  colors.green("\nOPTIONS:\n"),
  `   ${colors.yellow("-h, --help")}     print help info\n`,

  `   ${colors.yellow("-c, --custom")}   install custom package\n`,

  `   ${colors.yellow("-v, --version")}  print version\n`,

  `   ${colors.yellow("-m, --map")}      install package from deno.land\n`,

  `   ${colors.yellow("-n, --nest")}     install package from nest.land\n`,

  `   ${colors.yellow("-p, --pkg")}      install package from some repository\n`,

  colors.green("\nSUBCOMMANDS:\n"),
  `   ${colors.yellow("[install or i]")}  install a package.\n`,

  `   ${colors.yellow("delete")}          delete a package\n`,

  `   ${colors.yellow("upgrade")}         update imports\n`,

  `   ${colors.yellow("tree")}            view dependency tree\n`,

  `   ${colors.yellow("run")}             run a script alias in a file run.json\n`,

  colors.green(
    "\nyou can see the different options available for each command using:\n"
  ),

  `   ${colors.green("imports")}  ${colors.yellow("[command]")} ${colors.yellow(
    "--help or -h"
  )}\n`,
];

export const flags = {
  map: ["--map", "-m"],
  version: ["--version", "-v"],
  custom: ["--custom", "-c"],
  help: ["--help", "-h"],
  lock: ["--lock", "-l"],
  nest: ["--nest", "-n"],
  pkg: ["--pkg", "-p"],
};

export const keyWords = {
  install: ["install", "i"],
  uninstall: "delete",
  upgrade: "upgrade",
  tree: "tree",
  run: "run",
  purge: "purge",
};
