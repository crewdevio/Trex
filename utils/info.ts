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

export const VERSION = "Trex:\n Version v0.2.0 \n";

export const helpsInfo = [
  "* flags:",
  "   --map: for install a library",
  "   --version: logs version",
  "   --custom: for install custom package",
  "   --deps: log modules versions \n",

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
  "* check module stated using: ",
  "   Trex --deps"
];

export const flags = {
  map: "--map",
  version: "--version",
  custom: "--custom",
  help: "--help",
  deps: "--deps",
  all: ["--map", "--version", "--custom", "--help", "--deps"],
};

export const keyWords = { install: "install", i: "i", uninstall: "delete", tool: "getTool", update: "update" };
