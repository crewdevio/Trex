import { HELP_COMMANDS, FILE_COMMANDS } from "./constants/commands.ts";
import { help } from "./help.ts";
import { readDependencies } from "./file.ts";
import { addLatestVersions } from "./version.ts";

async function main(args: string[]) {
  if (args.length > 0) {
    const mainArgument = args[0];
    if (HELP_COMMANDS.includes(mainArgument)) {
      help();
    } else if (FILE_COMMANDS.includes(mainArgument)) {
      if (args[1]) {
        let dependencies = await readDependencies(args[1]);
        if (dependencies) {
          dependencies = await addLatestVersions(dependencies);
        }
        console.log("***** List of dependencies *****");
        console.table(dependencies);
      }
    }
  } else {
    console.debug("No arguments are passed ...");
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
