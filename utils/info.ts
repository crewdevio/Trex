/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as colors from "fmt/colors.ts";

const { green, yellow } = colors;
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
  "collections",
];

export const VERSION = { VERSION: "v1.9.1" };

export const helpsInfo = [
  green("advanced package management for deno, based on import_map.json\n"),

  green("\nUSAGE:\n"),
  `   trex ${yellow("[OPTIONS]")} ${yellow("[SUBCOMMAND]")}\n`,

  green("\nOPTIONS:\n"),
  `   ${yellow("-h, --help")}      print help info\n`,

  `   ${yellow("-c, --custom")}    install custom package\n`,

  `   ${yellow("-v, --version")}   print version\n`,

  `   ${yellow("-m, --map")}       install package from deno.land\n`,

  `   ${yellow("-n, --nest")}      install package from nest.land\n`,

  `   ${yellow("-p, --pkg")}       install package from some repository\n`,

  green("\nSUBCOMMANDS:\n"),
  `   ${yellow("[install or i]")}  install a package\n`,

  `   ${yellow("delete")}          delete a package\n`,

  `   ${yellow("upgrade")}         update trex\n`,

  `   ${yellow("tree")}            view dependency tree\n`,

  `   ${yellow("run")}             run a script alias in a file run.json\n`,

  `   ${yellow("purge")}           remove a package or url from cache\n`,

  `   ${yellow("ls")}              shows the list of installed packages\n`,

  `   ${yellow("exec")}            execute any cli tool without install\n`,

  green(
    "\nyou can see the different options available for each command using:\n"
  ),

  `   ${green("trex")}  ${yellow("[command]")} ${yellow("--help or -h")}\n`,
];

export const flags = {
  map: ["--map", "-m"],
  version: ["--version", "-v"],
  custom: ["--custom", "-c"],
  help: ["--help", "-h"],
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
  setup: "setup",
  ls: "ls",
  exec: "exec",
  versions: "versions",
};
