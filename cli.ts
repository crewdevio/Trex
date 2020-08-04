/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { installPackages, exist_imports, customPackage } from "./handlers/handle_packages.ts";
import { DeleteCacheModule, haveVersion } from "./handlers/handle_delete_package.ts";
import { green, yellow, red, cyan } from "https://deno.land/std/fmt/colors.ts";
import { LogHelp, Version, updateTrex, Somebybroken } from "./utils/logs.ts";
import { STD, VERSION, helpsInfo, flags, keyWords } from "./utils/info.ts";
import { getImportMap, createPackage } from "./handlers/handle_files.ts";
import { showImportDeps, packageTreeInfo } from "./tools/logs.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { LockFile } from "./handlers/handle_lock_file.ts";
import exec from "./tools/install_tools.ts";
import dbTool from "./tools/database.ts";
import { denoApidb } from "./utils/db.ts";

async function mainCli() {
  const _arguments = Deno.args;
  // * install some packages
  if (_arguments[0] === keyWords.install || _arguments[0] === keyWords.i) {

    if (existsSync("./import_map.json")) {

      try {
        const data = JSON.parse(getImportMap());
        const oldPackage = exist_imports(data);
        const newPackage = await installPackages(_arguments);

        await createPackage({ ...oldPackage, ...newPackage }, true);
      }

      catch (_) {
        throw new Error(_).message;
      }
    }

    else {
      await createPackage(await installPackages(_arguments), true);
    }
  }
  // * display trex version
  else if (_arguments[0] === flags.version) {
    Version(VERSION.VERSION);
  }

  else if (_arguments[0] === flags.help) {
    LogHelp(helpsInfo);
  }
  // * install a custom package
  else if (_arguments[0] === flags.custom) {
    customPackage(..._arguments)
  }
  // * uninstall some package
  else if (_arguments[0] === keyWords.uninstall) {
    const pkg: string = _arguments[1].trim();

    if (existsSync("./import_map.json")) {

      try {
        const Packages = JSON.parse(getImportMap());

        if (Packages?.imports) {
        delete Packages.imports[
          STD.includes(haveVersion(pkg))
          ? haveVersion(pkg) + "/"
          : haveVersion(pkg)
        ];

        if (STD.includes(haveVersion(pkg)) ||
            (await denoApidb(haveVersion(pkg)))?.length) {
          DeleteCacheModule(pkg);
        }

        const newPackage = exist_imports(Packages);

        await createPackage(newPackage);

        console.log(yellow(pkg + ":"), green(" removed from import_map.json"));
      }

      else {
        throw new Error(
          red("'imports' key not found in import_map.json")
            ).message;
      }
    }
      catch (_) {
        throw new Error(
          red("the import_map.json file does not have a valid format.")
            ).message;
      }
    }

    else {
      console.error(red("import_map.json"));
      return;
    }
  }
  // * install some tool like Commands
  else if (_arguments[0] === keyWords.tool) {
    const tool = _arguments[1].trim();
    if (Object.keys(dbTool).includes(tool)) {
      console.log(
        yellow("warning: "),
        cyan(tool),
        " have permissions: ",
        dbTool[tool].permissions
      );
      setTimeout(async () => {
        await exec({ config: dbTool[tool] });
        console.clear();
        console.log(`✅ Successfully installed ${tool}`);
      }, 3000);
    }

    else {
      throw new Error(
        red(`${red("Error: ")}${yellow(tool)} not found in the tools database`)
        ).message;
    }
  }
  // * update to lastest version of trex
  else if (_arguments[0] === keyWords.update) {
    await updateTrex();
  }
  // * shows the list of outdated packages
  else if (_arguments[0] === flags.deps) {
    showImportDeps()
  }
  // * shows the dependency tree of a package
  else if (_arguments[0] === keyWords.tree) {
    packageTreeInfo(..._arguments)

  }
  // * create lock file
  else if (_arguments[0] === flags.lock) {
    await LockFile(..._arguments);
  }

  else if (_arguments[0] === keyWords.run){

    const process = Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-read",
        "--allow-run",
        "--unstable",
        "https://deno.land/x/commands/Commands.ts",
        _arguments[1]
      ]
    });

    if (!(await process.status()).success) {
      process.close();
      Somebybroken();
    }
  }

  // * displays help information
  else {
    LogHelp(helpsInfo);
  }
}

if (import.meta.main) {
  await mainCli();
}
