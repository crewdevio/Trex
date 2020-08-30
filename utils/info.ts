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

export const VERSION = { VERSION: "v1.2.1-imports" };

export const helpsInfo = [
  colors.green(
    "advanced package management for deno, handling dependencies at any scale\n"
    ),

  colors.green("USAGE:"),
  `   [cli-name] ${colors.yellow('[OPTIONS]')} ${colors.yellow('[SUBCOMMAND]')}\n`,

  colors.green("OPTIONS:"),
  `   ${colors.yellow('--help, -h')}     print help info\n`,

  `   ${colors.yellow('--custom, -c')}   install custom package\n`,

  `   ${colors.yellow('--version, -v')}  print version\n`,

  `   ${colors.yellow('--map, -m')}      install package from deno.land\n`,

  `   ${colors.yellow('--lock, -l')}     create a lock files\n`,

  `   ${colors.yellow('--nest, -n')}     install package from nest.land\n`,

  `   ${colors.yellow('--pkg, -p')}      install package from some repository\n`,

  colors.green("SUBCOMMANDS:"),
  `   ${colors.yellow('[install or i]')}  install a package.\n`,

  `   ${colors.yellow('delete')}          delete a package\n`,

  `   ${colors.yellow('upgrade [name]')}  update cli\n`,

  `   ${colors.yellow('tree')}            view dependency tree\n`

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
  tree: "tree"
};
