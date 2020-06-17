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
];

export const VERSION = { VERSION: "v0.2.2" };

export const helpsInfo = [
  "advance package management for deno to implement an import_map.\n",

  "USAGE:",
  "   Trex [OPTIONS] [SUBCOMMAND]\n",

  "OPTIONS:",
  "   --help",
  "           Prints help information.",

  "   --custom",
  "           install custom module.",

  "   --version",
  "           Prints version information.",

  "   --deps",
  "           show dependencies versions.",

  "   --map",
  "           add module to import_mao.json.\n",

  "SUBCOMMANDS:",
  "   [install or i] install some module.",

  "   delete     delete a module from import_map.json.\n",

  "   getTool    install some tool.\n",

  "   update     update Trex.\n",

  "   treeDeps   view dependencie tree.\n"
];

export const flags = {
  map: "--map",
  version: "--version",
  custom: "--custom",
  help: "--help",
  deps: "--deps",
  all: ["--map", "--version", "--custom", "--help", "--deps"],
};

export const keyWords = {
  install: "install",
  i: "i",
  uninstall: "delete",
  tool: "getTool",
  update: "update",
  tree: "treeDeps"
};
