import { installPackages, exist_imports, customPackage} from "./handlers/handle_packages.ts";
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
import db from "./utils/db.ts";

async function mainCli() {
  const _arguments = Deno.args;

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

  else if (_arguments[0] === flags.version) {
    Version(VERSION.VERSION);
  }

  else if (_arguments[0] === flags.help) {
    LogHelp(helpsInfo);
  }

  else if (_arguments[0] === flags.custom) {
    customPackage(..._arguments)
  }

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

        if (STD.includes(haveVersion(pkg)) || db.includes(haveVersion(pkg))) {
          DeleteCacheModule(pkg);
        }

        const newPackage = exist_imports(Packages);

        await createPackage(newPackage);

        console.log(yellow(pkg + ":"), green(" removed from import_map.json"));
      }

      else {
        console.error(red("not found imports key in import_map.json"));
        return;
      }
    }
      catch (_) {
        throw new Error(
          red("the import_map.json file does not have a valid format.")
            ).message
      }
    }

    else {
      console.error(red("import_map.json"));
      return;
    }
  }

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
      }, 5000);
    }

    else {
      console.error(
        red("Error: "),
        yellow(tool),
        " is not in the tools database"
      );
    }
  }

  else if (_arguments[0] === keyWords.update) {
    await updateTrex();
  }

  else if (_arguments[0] === flags.deps) {
    showImportDeps()
  }

  else if (_arguments[0] === keyWords.tree) {
    packageTreeInfo(..._arguments)

  }

  else if (_arguments[0] === flags.lock) {
    await LockFile(..._arguments);
  }

  else {
    LogHelp(helpsInfo);
  }
}

if (import.meta.main) {
  await mainCli();
}
