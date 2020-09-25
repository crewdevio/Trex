import { readJson } from "../temp_deps/writeJson.ts";
import type { runJson } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";

const { red, yellow } = colors;

export async function Run(command: string) {
  if (!(await exists("./run.json"))) {
    throw new Error(red(`: ${yellow("run.json not found")}`)).message;
  } else {
    const runJsonFile = (await readJson("./run.json")) as runJson;

    if (!runJsonFile?.scripts) {
      throw new Error(
        red(`: ${yellow("the 'scripts' key not found in run.json file")}`)
      ).message;
    }

    const scripts = Object.keys(runJsonFile.scripts);

    const toRun = scripts
      .map((key) => (key === command ? runJsonFile.scripts[key] : undefined))
      .filter((el) => !!el) as string[];

    if (!toRun.length) {
      throw new Error(red(`: ${yellow("command not found")}`)).message;
    }

    const runnerCommand = toRun[0].split(" ").filter((arg) => !!arg);

    const process = Deno.run({
      cmd: [...runnerCommand],
    });

    if (!(await process.status()).success) {
      process.close();
      throw new Error("error running command " + toRun[0]).message;
    } else {
      process.close();
    }
  }
}
