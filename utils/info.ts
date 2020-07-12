/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { green, yellow, red } from "https://deno.land/std/fmt/colors.ts";

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

export const VERSION = { VERSION: "v1.0.0-rc2" };

export const helpsInfo = [
  green("advance package management for deno to implement an import_map.json\n"),

  green("USAGE:"),
  `   Trex ${yellow('[OPTIONS]')} ${yellow('[SUBCOMMAND]')}\n`,

  green("OPTIONS:"),
  `   ${yellow('--help')}     Prints help information.\n`,

  `   ${yellow('--custom')}   install custom package.\n`,

  `   ${yellow('--version')}  Prints version information.\n`,

  `   ${yellow('--deps')}     shows the list of outdated packages.\n`,

  `   ${yellow('--map')}      add package to import_map.json.\n`,

  `   ${yellow('--lock')}     create a lock files.\n`,

  `   ${yellow('--nest')}     install package from nest.land.\n`,

  `   ${yellow('--pkg')}      install package from some repository.\n`,

  green("SUBCOMMANDS:"),
  `   ${yellow('[install or i]')}  install some package.\n`,

  `   ${yellow(`delete${red(' <@version>')}`)}  delete a package from import map and cache.\n`,

  `   ${yellow('getTool')}  install some tool.\n`,

  `   ${yellow('update')}  update Trex.\n`,

  `   ${yellow('treeDeps')}  view dependencie tree.\n`,
];

export const flags = {
  map: "--map",
  version: "--version",
  custom: "--custom",
  help: "--help",
  deps: "--deps",
  lock: "--lock",
  nest: "--nest",
  pkg: "--pkg",
};

export const keyWords = {
  install: "install",
  i: "i",
  uninstall: "delete",
  tool: "getTool",
  update: "update",
  tree: "treeDeps",
};
