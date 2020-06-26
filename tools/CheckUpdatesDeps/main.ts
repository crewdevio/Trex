import { FILE_COMMANDS } from "./constants/commands.ts";
import { Versions } from "./version.ts";
import { readDependencies } from "./file.ts";

async function main(args: string[]) {
  if (args.length > 0) {
    const mainArgument = args[0];
    if (FILE_COMMANDS.includes(mainArgument)) {
      if (args[1]) {
        let dependencies = await readDependencies(args[1]);
        if (dependencies) {
          dependencies = await Versions(dependencies);
        }
        console.log("<== List of dependencies ==>");
        console.table(dependencies);
      }
    }
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
