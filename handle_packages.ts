import { STD, URI_STD, URI_X, flags } from "./utils.ts";
import { yellow, cyan, red } from "https://deno.land/std/fmt/colors.ts";
import db from "./db.ts";

export function updatePackages(Package: { imports: Object }) {
  if (Package?.imports) {
    // * if exist in import_map the key import return all modules
    return Package.imports;
  } else {
    // * else return error obj
    return {
      error: "imports not found",
      were: "import_map.json",
    };
  }
}

export function installPakages(args: string[]) {
  const map = {};
  if (args[1] === flags.map) {
    for (let index = 2; index < args.length; index++) {
      if (STD.includes(args[index])) {
        // @ts-ignore

        // * if is a std lib create a uri std
        map[args[index] + "/"] = URI_STD + args[index].trim() + "/";
      } else if (db.includes(args[index])) {
        // @ts-ignore

        // * create Third Party Modules uri and log warning
        map[args[index]] = URI_X + args[index].trim() + "/" + "mod.ts";
        console.log(
          yellow("warning: "),
          cyan(args[index]),
          "added as third party modules, default mod.ts"
        );
      } else {
        console.log(
          red("Error: "),
          yellow(args[index]) + " not is a third party modules \n",
          "intall using custom install"
        );
      }
    }
  }

  return map;
}
