import { existsSync, writeJson } from "https://deno.land/std/fs/mod.ts";
import { green, red, yellow, white, cyan } from "https://deno.land/std/fmt/colors.ts";
import { STD, URI_STD, URI_X, VERSION, helpsInfo } from "./utils.ts";

const input = Deno.args;

const map = {};

if (input[0] === "install" || input[0] === "i") {
  if (existsSync("./import_map.json")) {
    const data = JSON.parse(checkPackage());
    const oldPackage = updatePackages(data);
    const newPAckage = installPakages();
    // @ts-ignore
    if (oldPackage?.error) {
      // @ts-ignore
      console.log(yellow(`in: ${white(`${oldPackage.were}`)}`));
      //@ts-ignore
      console.log(yellow(`error: ${white(`${oldPackage.error}`)}`));
    } else {
      await createPackage({ ...oldPackage, ...newPAckage });
    }
  } else {
    await createPackage(installPakages());
  }
} else if (input[0] === "--version") {
  Version();
} else if (input[0] === "--help") {
  LogHelp();
}

async function createPackage(template: Object) {
  await Deno.createSync("./import_map.json");
  await writeJson("./import_map.json", { imports: template }, { spaces: 2 });
  console.group("Packages: ")
  for (const pkg in template) {
    console.log(('|- '), cyan(pkg));
  }
  console.groupEnd();
  console.log(green("Happy Coding"));
}

function updatePackages(Package: { imports: Object }) {
  if (Package?.imports) {
    return Package.imports;
  } else {
    return {
      error: "imports not found",
      were: "import_map.json",
    };
  }
}

function checkPackage() {
  const decoder = new TextDecoder("utf-8");
  const Package = Deno.readFileSync("./import_map.json");

  return decoder.decode(Package);
}

function installPakages() {
  if (input[1] === "--map") {
    for (let index = 2; index < input.length; index++) {
      if (STD.includes(input[index])) {
        // @ts-ignore
        map[input[index] + "/"] = URI_STD + input[index].trim() + "/";
      } else {
        // @ts-ignore
        map[input[index]] = URI_X + input[index].trim() + "/" + "mod.ts";
        console.log(
          yellow("warning: "),
          red(input[index]),
          " not is a std module, added as third party modules"
        );
      }
    }
  }

  return map;
}

function LogHelp() {
  console.group(cyan("help:"));
  for (const info of helpsInfo) {
    console.log(info);
  }
  console.groupEnd();
}

function Version() {
  console.log(green(VERSION));
}
