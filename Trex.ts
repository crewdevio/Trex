import { green, yellow, white } from "https://deno.land/std/fmt/colors.ts";
import { installPakages, updatePackages } from "./handle_packages.ts";
import { STD, VERSION, helpsInfo, flags, keyWords } from "./utils.ts";
import { checkPackage, createPackage } from "./handle_files.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { LogHelp, Version } from "./logs.ts";

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
      await createPackage({ ...oldPackage, ...newPAckage }, true);
    }
  } else {
    await createPackage(installPakages(input), true);
  }
} else if (input[0] === flags.version) {
  Version(VERSION);
} else if (input[0] === flags.help) {
  LogHelp(helpsInfo);
} else if (input[0] === flags.custom) {
  const data = input[1].includes("=")
    ? input[1].split("=")
    : ["Error", "Add a valid package"];
  const custom = {};
  //@ts-ignore
  custom[data[0]] = data[1];
  // * if import_map exists update it
  if (existsSync("./import_map.json")) {
    const data = JSON.parse(checkPackage());
    const oldPackage = updatePackages(data);

    await createPackage({ ...custom, ...oldPackage }, true);
  } else {
    // * else create package
    await createPackage(custom, true);
  }
} else if (input[0] === keyWords.uninstall) {
  const pkg: string = input[1].trim();

  if (existsSync("./import_map.json")) {
    const Packages = JSON.parse(checkPackage());

    if (Packages?.imports) {
      delete Packages.imports[STD.includes(pkg) ? pkg + "/" : pkg];

      const newPackage = updatePackages(Packages);

      await createPackage(newPackage);

      console.log(yellow(pkg + ": "), green("package removed"));
    } else {
      const error: Error = new Deno.errors.NotFound(
        "not found imports key in import_map.json"
      );
      console.error(error);
    }
  } else {
    const error: Error = new Deno.errors.NotFound("import_map.json");

    console.error(error);
  }
}
