import { existsSync, writeJson } from "https://deno.land/std/fs/mod.ts";
import { green, yellow, white, cyan } from "https://deno.land/std/fmt/colors.ts";
import { STD, URI_STD, URI_X, VERSION, helpsInfo, flags, keyWords } from "./utils.ts";

const input = Deno.args;

if (input[0] === keyWords.install || input[0] === keyWords.i) {
  if (existsSync("./import_map.json")) {
    const data = JSON.parse(checkPackage());
    const oldPackage = updatePackages(data);
    const newPAckage = installPakages(input);
    // @ts-ignore
    if (oldPackage?.error) {
      // @ts-ignore
      console.error(yellow(`in: ${white(`${oldPackage.were}`)}`));
      //@ts-ignore
      console.error(yellow(`error: ${white(`${oldPackage.error}`)}`));
    } else {
      await createPackage({ ...oldPackage, ...newPAckage });
    }
  } else {
    await createPackage(installPakages(input));
  }
} else if (input[0] === flags.version) {
  Version();
} else if (input[0] === flags.help) {
  LogHelp();
} else if (input[0] === flags.custom) {
  const data = input[1].includes("=")
    ? input[1].split("=")
    : ['Error', 'Add a valid package'];
  const custom = {};
  //@ts-ignore
  custom[data[0]] = data[1];
  // * if import_map exists update it
  if (existsSync("./import_map.json")) {
    const data = JSON.parse(checkPackage());
    const oldPackage = updatePackages(data);

    await createPackage({ ...custom, ...oldPackage });
  } else {
    // * else create package
    await createPackage(custom);
  }
} else if (input[0] === keyWords.uninstall) {
  const pkg: string | Error = input[1]
    ? input[1].trim()
    : new Deno.errors.InvalidData("no valid module");

  console.log(pkg);
}

async function createPackage(template: Object) {
  // * create import_map.json
  await Deno.createSync("./import_map.json");
  // * write import config inside import_map.json
  await writeJson("./import_map.json", { imports: template }, { spaces: 2 });
  console.group("Packages list: ");
  for (const pkg in template) {
    console.log("|- ", cyan(pkg));
  }
  console.groupEnd();
  console.log(green("Happy Coding"));
}

function updatePackages(Package: { imports: Object }) {
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

function checkPackage() {
  const decoder = new TextDecoder("utf-8");

  // * get data from import_map and return data
  const Package = Deno.readFileSync("./import_map.json");

  return decoder.decode(Package);
}

function installPakages(args: string[]) {
  const map = {};
  if (args[1] === flags.map) {
    for (let index = 2; index < args.length; index++) {
      if (STD.includes(args[index])) {
        // @ts-ignore

        // * if is a std lib create a uri std
        map[args[index] + "/"] = URI_STD + args[index].trim() + "/";
      } else {
        // @ts-ignore

        // * create Third Party Modules uri and log warning
        map[args[index]] = URI_X + args[index].trim() + "/" + "mod.ts";
        console.log(
          yellow("warning: "),
          cyan(args[index]),
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
  console.log(green(VERSION), cyan("༼ つ ◕_◕ ༽つ"));
}