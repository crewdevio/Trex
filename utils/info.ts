/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors } from "../imports/fmt.ts";

const { green, yellow, red } = colors;
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

export const VERSION = { VERSION: "v1.2.1" };

export const helpsInfo = [
  green("advanced package management for deno, based on import_map.json\n"),

  green("USAGE:"),
  `   trex ${yellow('[OPTIONS]')} ${yellow('[SUBCOMMAND]')}\n`,

  green("OPTIONS:"),
  `   ${yellow('--help')}     print help information.\n`,

  `   ${yellow('--custom')}   install custom package.\n`,

  `   ${yellow('--version')}  print version information.\n`,

  `   ${yellow('--map')}      add package to import_map.json.\n`,

  `   ${yellow('--lock')}     create a lock files.\n`,

  `   ${yellow('--nest')}     install package from nest.land.\n`,

  `   ${yellow('--pkg')}      install package from some repository.\n`,

  green("SUBCOMMANDS:"),
  `   ${yellow('[install or i]')}  install a package.\n`,

  `   ${yellow(`delete${red('<@version>')}`)}  delete a package from import map and cache.\n`,

  `   ${yellow('update')}    update Trex.\n`,

  `   ${yellow('treeDeps')}  view dependency tree.\n`

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
