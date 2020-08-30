/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { installPackages, customPackage } from "./handlers/handle_packages.ts";
import { VERSION, helpsInfo, flags, keyWords } from "./utils/info.ts";
import { deletePackage } from "./handlers/handle_delete_package.ts";
import { LogHelp, Version, updateTrex } from "./utils/logs.ts";
import { LockFile } from "./handlers/handle_lock_file.ts";
import { createFolder } from "./handlers/handle_files.ts";
import { packageTreeInfo } from "./tools/logs.ts"
import { exists } from "./imports/fs.ts";

async function mainCli() {
  const _arguments = Deno.args;
  // * install some packages
  if (_arguments[0] === keyWords.install || _arguments[0] === keyWords.i) {

    if (await exists("./imports/")) {

      try {
        await installPackages(_arguments);
      }
      catch (err) {
        console.log(err);
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
    deletePackage(_arguments);
  }
  // * update to lastest version of trex
  else if (_arguments[0] === keyWords.update) {
    await updateTrex();
  }
  // * shows the dependency tree of a package
  else if (_arguments[0] === keyWords.tree) {
    await packageTreeInfo(_arguments);
  }
  // * create lock file
  else if (_arguments[0] === flags.lock) {
    await LockFile(..._arguments);
  }
  // * displays help information
  else {
    LogHelp(helpsInfo);
  }
}

if (import.meta.main) {
  await mainCli();
}
