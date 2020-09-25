/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { installPackages, exist_imports, customPackage } from "./handlers/handle_packages.ts";
import { getImportMap, createPackage } from "./handlers/handle_files.ts";
import { VERSION, helpsInfo, flags, keyWords } from "./utils/info.ts";
import { LogHelp, Version, updateTrex } from "./utils/logs.ts";
import { deletepackage } from "./handlers/delete_package.ts";
import { LockFile } from "./handlers/handle_lock_file.ts";
import { packageTreeInfo } from "./tools/logs.ts";
import { colors } from "./imports/fmt.ts";
import { exists } from "./imports/fs.ts";
import { Run } from "./commands/run.ts";

const { red, green, yellow } = colors;
async function mainCli() {
  const _arguments = Deno.args;
  // * install some packages
  if (keyWords.install.includes(_arguments[0])) {

    if (await exists("./import_map.json")) {

      try {
        const data = JSON.parse(await getImportMap());
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
  else if (flags.version.includes(_arguments[0])) {
    Version(VERSION.VERSION);
  }

  else if (flags.help.includes(_arguments[0])) {
    LogHelp(helpsInfo);
  }
  // * install a custom package
  else if (flags.custom.includes(_arguments[0])) {
    customPackage(..._arguments)
  }
  // * uninstall some package
  else if (_arguments[0] === keyWords.uninstall) {
    await deletepackage(_arguments[1]);
  }
  // * update to lastest version of trex
  else if (_arguments[0] === keyWords.upgrade) {
    await updateTrex();
  }
  // * shows the dependency tree of a package
  else if (_arguments[0] === keyWords.tree) {
    await packageTreeInfo(..._arguments)

  }
  // * create lock file
  else if (_arguments[0] === flags.lock) {
    await LockFile(..._arguments);
  }

  else if (_arguments[0] === keyWords.run){
    await Run(_arguments[1])
  }

  // * displays help information
  else {
    LogHelp(helpsInfo);
  }
}

if (import.meta.main) {
  await mainCli();
}
