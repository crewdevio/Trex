/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseToYaml } from "../tools/parseToyaml.ts";
import { readJson } from "../temp_deps/writeJson.ts";
import type { runJson } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";
import { join } from "../imports/path.ts";

const { red, yellow, green } = colors;
const { env, run, args } = Deno;

// run args command
let [, , ...runArgs] = args;
const [, ...Args] = runArgs;
// ignore '--watch' and '-w' in injected args
runArgs =
  runArgs[0] === "--watch" || runArgs[0] === "-w" || runArgs[0] === "-wv"
    ? [...Args]
    : [...runArgs];

/**
 * execute subprocess script
 * @param command
 */
export async function Run(command: string) {
  let prefix = (await exists("./run.json")) ? "json" : "yaml";

  if (!(await exists("./run.json")) && !(await exists("./run.yaml")) && !(await exists("./run.yml"))) {
    throw new Error(red(`: ${yellow("run.json or run.yaml not found")}`)).message;
  }

  if (await exists("./run.json") && await exists("./run.yaml") && (await exists("./run.yml"))) {
    throw new Error(red(`: ${yellow("use a single format run.json or run.yaml file")}`)).message;
  }


  else {
    async function Thread() {

      try {
        const runJsonFile = prefix === "json"
                            ? (await readJson("./run.json")) as runJson
                            : (await parseToYaml());

        if (!runJsonFile?.scripts) {
          throw new Error(
            red(`: ${yellow(`the 'scripts' key not found in run.${prefix} file`)}`)
          ).message;
        }

        const scripts = Object.keys(runJsonFile.scripts);
        console.log(runJsonFile)

        const toRun = scripts
          .map((key) =>
            key === command ? runJsonFile.scripts[key] : undefined
          )
          .filter((el) => !!el) as string[];

        if (!toRun.length) {
          throw new Error(red(`: ${yellow("command not found")}`)).message;
        }
        // normalize command
        const runnerCommand = toRun[0].split(" ").filter((arg) => !!arg);

        // get path to deno scripts
        const scriptPath =
          Deno.build.os === "windows"
            ? // to windows base
              join(
                "C:",
                "Users",
                env.get("USERNAME")!,
                ".deno",
                "bin",
                runnerCommand[0]
              )
            : // to unix base
              join(env.get("HOME")!, ".deno", "bin", runnerCommand[0]);

        // prevent deno scrips not found error
        if ((await exists(scriptPath)) || (await exists(`${scriptPath}.cmd`))) {
          if (Deno.build.os === "linux" || Deno.build.os === "darwin") {
            runnerCommand[0] = scriptPath;
          } else if (Deno.build.os === "windows") {
            runnerCommand[0] = `${runnerCommand[0]}.cmd`;
          }
        }

        const [currentCMD, execCommand] = [
          ["trex", "run", command].join(" "),
          [...runnerCommand]
            .map((cmd) => cmd.trim())
            .join(" ")
            .replaceAll(".cmd", ""),
        ];

        const last = execCommand.split("/");

        // remove path to compare on unix base os
        const toCompare =
          Deno.build.os === "linux" || Deno.build.os == "darwin"
            ? last[last.length - 1]
            : execCommand;

        // prevent circular call
        if (currentCMD === toCompare) {
          throw new EvalError(
            `${yellow("Circular call found in: ")}${red(toRun[0])}`
          ).message;
        }

        const process = run({
          cmd: [...runnerCommand, ...runArgs],
          env: env.toObject(),
          cwd: Deno.cwd(),
        });

        if (!(await process.status()).success) {
          process.close();
          throw new Error(`Error: running command ${red(toRun[0])}`).message;
        }

        process.close();
      }

      catch (err) {
        throw new Error(
          err instanceof SyntaxError
            ? colors.red(
                `the ${colors.yellow(
                  `'run.${prefix}'`
                )} file not have a valid syntax`
              )
            : err instanceof Deno.errors.NotFound
            ? colors.red(err.message)
            : colors.yellow(err)
        ).message;
      }
    }

    const filesToWatch = prefix === "json"
                         ? (await readJson("./run.json")) as runJson
                         : (await parseToYaml());

    const watchFlags =
      Deno.args[2] === "--watch" ||
      Deno.args[2] === "-w" ||
      Deno.args[2] === "-wv";

    // run using trp (trex reboot protocol)
    if (filesToWatch?.files && watchFlags) {
      const files = filesToWatch.files.length ? [...filesToWatch.files] : ["."];

      let throttle = 700;
      let timeout: number | null = null;

      function logMessages(verbose?: Deno.FsEvent) {
        console.clear();
        console.log(green("[Reboot protocol]"));
        console.log(green("[*] watching files:"));
        console.info(
          red(
            `[#] exit using ctrl+c \n ${
              filesToWatch?.files?.length
                ? filesToWatch.files
                    .map((file) => {
                      console.log(" |- ", yellow(join(file)));
                      return "";
                    })
                    .join("")
                : (console.log(
                    ` |- ${yellow("all files [ .* ]")}`
                  ) as undefined) ?? ""
            } `
          )
        );
        if (Deno.args[2] === "-wv" && verbose) {
          console.log(
            green(` ╭─ Verbose output ${yellow("-wv")}:\n`),
            green(`│- Event Kind: ${yellow(verbose?.kind)}\n`),
            green(`╰─ Path: ${yellow(verbose?.paths.join(""))}\n`)
          );
        }
      }

      logMessages();
      await Thread();
      for await (const event of Deno.watchFs(files, { recursive: true })) {
        if (event.kind !== "access") {
          if (timeout) clearTimeout(timeout);
          console.log(yellow("reloading..."));
          logMessages(event);
            timeout = setTimeout(Thread, throttle);
        }
      }
    }
    // run a single exec thread
    else {
      await Thread();
    }
  }
}
