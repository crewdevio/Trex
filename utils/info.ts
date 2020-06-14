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

export const VERSION = { VERSION: "v0.2.1" };

export const helpsInfo = [
  "Package management for deno to implement an import_map.json for your imports is an easiest way to make imports in deno.\n",

  "* install module using: ",
  "   Trex install --map module_name \n",
  "* install custom module usig: ",
  "   Trex --custom module_name=module_url \n",
  "* uninstall module using: ",
  "   Trex delete module_name \n",
  "* install Tool using: ",
  "   Trex getTool tool_name \n",
  "* update Trex using: ",
  "   Trex update \n",
  "* check modules version using: ",
  "   Trex --deps\n",

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
  "   [install or i] install some module",

  "   delete     delete a module from import_map.json.\n",

  "   getTool    install some tool.\n",

  "   update     update Trex."
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
};
