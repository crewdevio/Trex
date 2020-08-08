/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { installPackages, customPackage } from "./handlers/handle_packages.ts";
import { LogHelp, Version, updateTrex, Somebybroken } from "./utils/logs.ts";
import { VERSION, helpsInfo, flags, keyWords } from "./utils/info.ts";
import { LockFile } from "./handlers/handle_lock_file.ts";
import { createFolder } from "./handlers/handle_files.ts";
import { packageTreeInfo } from "./tools/logs.ts"
import { errorsMessage } from "./utils/types.ts";
import { existsSync } from "./imports/fs.ts";
import { colors } from "./imports/fmt.ts";

async function mainCli() {
  const _arguments = Deno.args;
  // * install some packages
  if (_arguments[0] === keyWords.install || _arguments[0] === keyWords.i) {

    if (existsSync("./imports/")) {

      try {
        await installPackages(_arguments);
      }
      catch (err) {
        throw new Error(err).message;
      }
    }
    else {
      await createFolder();
      await installPackages(_arguments);
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
    // * test if exist imports folder
    if (existsSync("./imports/")) {

      try {
        const { removeSync } = Deno;

        for (let i = 1; i < _arguments.length; i++) {
          const pkgName = _arguments[i];
          removeSync(`./imports/${pkgName}.ts`, { recursive: true });
        }
    }
    catch (_) {
        throw new Error(
          colors.red(
            errorsMessage.deleteError
            )).message;
      }
    }

    else {
      throw new Error(
        colors.red(
          errorsMessage.importsFolder
          )).message;
    }
  }
  // * update to lastest version of trex
  else if (_arguments[0] === keyWords.update) {
    await updateTrex();
  }
  // * shows the dependency tree of a package
  else if (_arguments[0] === keyWords.tree) {
    await packageTreeInfo()

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
