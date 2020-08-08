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

export const VERSION = { VERSION: "v2.0.0" };

export const helpsInfo = [
  colors.green("advanced package management for deno, based on import_map.json\n"),

  colors.green("USAGE:"),
  `   trex ${colors.yellow('[OPTIONS]')} ${colors.yellow('[SUBCOMMAND]')}\n`,

  colors.green("OPTIONS:"),
  `   ${colors.yellow('--help')}     print help information.\n`,

  `   ${colors.yellow('--custom')}   install custom package.\n`,

  `   ${colors.yellow('--version')}  print version information.\n`,

  `   ${colors.yellow('--map')}      add package to import_map.json.\n`,

  `   ${colors.yellow('--lock')}     create a lock files.\n`,

  `   ${colors.yellow('--nest')}     install package from nest.land.\n`,

  `   ${colors.yellow('--pkg')}      install package from some repository.\n`,

  colors.green("SUBCOMMANDS:"),
  `   ${colors.yellow('[install or i]')}  install a package.\n`,

  `   ${colors.yellow(`delete${colors.red('<@version>')}`)}  delete a package from import map and cache.\n`,

  `   ${colors.yellow('update')}    update Trex.\n`,

  `   ${colors.yellow('treeDeps')}  view dependency tree.\n`

];

export const flags = {
  map: "--map",
  version: "--version",
  custom: "--custom",
  help: "--help",
  lock: "--lock",
  nest: "--nest",
  pkg: "--pkg",
};

export const keyWords = {
  install: "install",
  i: "i",
  uninstall: "delete",
  update: "update",
  tree: "treeDeps",
  run: "run"
};
