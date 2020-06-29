export const URI_STD = "https://deno.land/std";

export const URI_X = "https://deno.land/x/";

export const STD = [
  "_util",
  "fs",
  "http",
  "archive",
  "async",
  "bytes",
  "datatime",
  "encoding",
  "examples",
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

export const VERSION = { VERSION: "v0.2.4" };

export const helpsInfo = [
  "advance package management for deno to implement an import_map.\n",

  "USAGE:",
  "   Trex [OPTIONS] [SUBCOMMAND]\n",

  "OPTIONS:",
  "   --help     Prints help information.\n",

  "   --custom   install custom package.\n",

  "   --version  Prints version information.\n",

  "   --deps     show dependencies versions.\n",

  "   --map      add package to import_map.json.\n",

  "   --lock     create a lock files.\n",

  "   --nest     install package from nest.land.\n",

  "   --pkg      install package from some repository.\n",

  "SUBCOMMANDS:",
  "   [install or i]  install some pacakege.\n",

  "   delete<@version>  delete a package from import_map.json and cache.\n",

  "   getTool  install some tool.\n",

  "   update  update Trex.\n",

  "   treeDeps  view dependencie tree.\n",
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
