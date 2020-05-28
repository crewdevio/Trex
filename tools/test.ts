// base code https://github.com/Caesar2011/rhinoder

import { readFileStrSync, existsSync } from "https://deno.land/std/fs/mod.ts";

import { red, green } from "https://deno.land/std/fmt/colors.ts";

const data = JSON.parse(readFileStrSync("./run.json"));

const throttle = 500;
let timeout: number | null = null;

let errorTrace: string[] = [];

interface Icommands {
  name: string;
  run: string[] | unknown;
}

const commands: Array<Icommands> = [];

if (existsSync("./run.json")) {
  if (!data?.config) {
    errorTrace.push("[Error]: config param not found in run.json");
  } else {
    console.log(green("listening to changes..."));

    const entries = Object.entries(data.config);

    entries.forEach((entrie) => {
      // @ts-ignore
      commands.push({ name: entrie[0], run: entrie[1].split(" ") });
    });
  }
} else {
  errorTrace.push("[Error]: run.json not found");
}

if (errorTrace.length) {
  for (const error of errorTrace) {
    console.log(red(error) + "\n");
  }
}

const run: Array<string | unknown> = ["run"];

commands.forEach(({ name }, index) => {
  if (name === Deno.args[0]) {
    // @ts-ignore
    commands[index].run.forEach((el) => {
      run.push(el.trim());
    });
  }
});

let app: Deno.Process = startProcess(run);

function startProcess(args: Array<any>): Deno.Process {
  if (args.length <= 1) {
    console.log(red("[Error]: Command not found"));
  }
  return Deno.run({ cmd: ["deno", ...args] });
}

function runApp() {
  app && app.close();
  app = startProcess(run);
}

let files: string[] | string = data?.files
  ? data.files && data.files.length
    ? data.files
    : "."
  : ".";

for await (const event of Deno.watchFs(files)) {
  if (event.kind !== "access") {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(runApp, throttle);
  }
}