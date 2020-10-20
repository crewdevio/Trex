/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  installPackages,
  exist_imports,
  customPackage,
} from "./handlers/handle_packages.ts";
import {
  LogHelp,
  Version,
  updateTrex,
  HelpCommand,
  CommandNotFound,
} from "./utils/logs.ts";
import { getImportMap, createPackage } from "./handlers/handle_files.ts";
import { VERSION, helpsInfo, flags, keyWords } from "./utils/info.ts";
import { deletepackage } from "./handlers/delete_package.ts";
import { purge } from "./handlers/purge_package.ts";
import { packageTreeInfo } from "./tools/logs.ts";
import { setupIDE } from "./tools/setupIDE.ts"
import { exists } from "./imports/fs.ts";
import { Run } from "./commands/run.ts";

async function mainCli() {
  const _arguments = Deno.args;
  // * install some packages
  if (keyWords.install.includes(_arguments[0])) {
    // * prevent error in trex install
    if (_arguments[1]) {
      CommandNotFound({
        commands: keyWords.install,
        flags: [...flags.map, ...flags.nest, ...flags.pkg, ...flags.help],
      });
    }

    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: keyWords.install,
          description: "install a package",
        },
        flags: [
          { alias: flags.map, description: "install package from deno.land" },
          { alias: flags.nest, description: "install package from nest.land" },
          {
            alias: flags.pkg,
            description: "install package from some repository",
          },
          { alias: flags.help, description: "show command help" },
        ],
      });
    }

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
    } else {
      await createPackage(await installPackages(_arguments), true);
    }
  }
  // * display trex version
  else if (flags.version.includes(_arguments[0])) {
    Version(VERSION.VERSION);
  }
  // * show help info
  else if (flags.help.includes(_arguments[0])) {
    LogHelp(helpsInfo);
  }
  // * install a custom package
  else if (flags.custom.includes(_arguments[0])) {

    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: flags.custom,
          description: "install custom package",
        },
        flags: [{ alias: flags.help, description: "show command help" }],
      });
    }


    customPackage(..._arguments);
  }
  // * uninstall some package
  else if (_arguments[0] === keyWords.uninstall) {
    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: [keyWords.uninstall],
          description: "delete a package",
        },
        flags: [
          {
            alias: flags.help,
            description: "show command help",
          },
        ],
      });
    }

    await deletepackage(_arguments[1]);
  }
  // * update to lastest version of trex
  else if (_arguments[0] === keyWords.upgrade) {
    if (_arguments[1]) {
      CommandNotFound({
        commands: [keyWords.upgrade],
        flags: [...flags.help],
      });
    }

    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: [keyWords.upgrade],
          description: "update trex",
        },
        flags: [{ alias: flags.help, description: "show command help" }],
      });
    }

    await updateTrex();
  }
  // * shows the dependency tree of a package
  else if (_arguments[0] === keyWords.tree) {
    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: [keyWords.tree],
          description: "view dependency tree",
        },
        flags: [{ alias: flags.help, description: "show command help" }],
      });
    }

    await packageTreeInfo(..._arguments);
  }

  // * run script aliases
  else if (_arguments[0] === keyWords.run) {
    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: [keyWords.run],
          description: "run a script alias in a file run.json",
        },
        flags: [{ alias: flags.help, description: "show command help" }],
      });
    }

    await Run(_arguments[1]);
  }

  // * setup command
  else if (_arguments[0] === keyWords.setup){

    CommandNotFound({
      commands: [keyWords.setup],
      flags: ["--vscode", "--atom", ...flags.help]
    })

    if (flags.help.includes(_arguments[1])) {
      return HelpCommand({
        command: {
          alias: [keyWords.setup],
          description: "create a deno configuration for your IDE",
        },
        flags: [
          {
            alias: flags.help,
            description: "show command help"
          },
          {
            alias: ["--vscode"],
            description: "create the necessary configuration for vscode"
          },
          {
            alias: ["--atom"],
            description: "create the necessary configuration for atom"
          }
        ],
      });
    }

    setupIDE(_arguments[1])
  }

  // * purge command
  else if (_arguments[0] === keyWords.purge) {
    HelpCommand({
      command: {
        alias: [keyWords.purge],
        description: "remove a package or url from cache"
      },
      flags: [
        {
          alias: flags.help,
          description: "show command help"
        }
      ]
    });

    await purge();
  }

  // * displays help information
  else {
    CommandNotFound({
      commands: [
        keyWords.purge,
        keyWords.run,
        keyWords.tree,
        ...keyWords.install,
        keyWords.uninstall,
        keyWords.upgrade,
        ...flags.help,
        ...flags.version,
        keyWords.setup
      ],
      flags: [],
    });
  }
}

if (import.meta.main) {
  await mainCli();
}
