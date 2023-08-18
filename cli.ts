/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  customPackage,
  existImports,
  installPackages,
} from "./handlers/handle_packages.ts";
import {
  CommandNotFound,
  HelpCommand,
  LogHelp,
  LogPackages,
  updateTrex,
  Version,
} from "./utils/logs.ts";
import { createPackage, getImportMap } from "./handlers/handle_files.ts";
import { flags, helpsInfo, keyWords, VERSION } from "./utils/info.ts";
import { checkDepsUpdates } from "./handlers/handler_check.ts";
import { deletepackage } from "./handlers/delete_package.ts";
import { execution } from "./handlers/handle_execution.ts";
import { Config } from "./handlers/global_configs.ts";
import { purge } from "./handlers/purge_package.ts";
import { packageTreeInfo } from "./tools/logs.ts";
import type { importMap } from "./utils/types.ts";
import { LoadingSpinner } from "./tools/logs.ts";
import { Run, Scripts } from "./commands/run.ts";
import * as colors from "fmt/colors.ts";
import { exists } from "tools-fs";
import { Spinner } from "wait";

const { bold, green, yellow, red } = colors;

async function Main() {
  try {
    const Args = Deno.args;
  
    // * install some packages
    if (keyWords.install.includes(Args[0])) {
      // * prevent error in trex install
      if (Args[1]) {
        CommandNotFound({
          commands: keyWords.install,
          flags: [...flags.map, ...flags.nest, ...flags.pkg, ...flags.help],
        });
      }
  
      if (flags.help.includes(Args[1])) {
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
  
      if (await exists(`./${Config.getConfig("importMap")}`)) {
        try {
          const data = (await getImportMap()) as any;
          const oldPackage = existImports(data);
          const newPackage = await installPackages(Args);
  
          await createPackage({ ...oldPackage, ...newPackage }, true);
        } catch (error) {
          throw new Error(error).message;
        }
      } else {
        await createPackage(await installPackages(Args), true);
      }
  
      const runJson = await Scripts();
      // post install hook
      if (runJson?.scripts?.postinstall) await Run("postinstall");
    } // * display trex version
    else if (flags.version.includes(Args[0])) {
      Version(VERSION.VERSION);
    } // * show help info
    else if (flags.help.includes(Args[0])) {
      LogHelp(helpsInfo);
    } // * install a custom package
    else if (flags.custom.includes(Args[0])) {
      if (flags.help.includes(Args[1])) {
        return HelpCommand({
          command: {
            alias: flags.custom,
            description: "install custom package",
          },
          flags: [{ alias: flags.help, description: "show command help" }],
        });
      }
  
      customPackage(Args);
    } // * uninstall some package
    else if (Args[0] === keyWords.uninstall) {
      if (flags.help.includes(Args[1])) {
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
  
      let loading: Spinner;
      const [, ...pkgs] = Args;
      for (const pkg of pkgs) {
        // @ts-ignore
        loading = LoadingSpinner(
          green(
            `Removing ${bold(yellow(pkg))} from ${Config.getConfig("importMap")}`,
          ),
        )!;
        await deletepackage(pkg);
        loading?.stop();
      }
    } // * update to lastest version of trex
    else if (Args[0] === keyWords.upgrade) {
      if (Args[1]) {
        CommandNotFound({
          commands: [keyWords.upgrade],
          flags: [...flags.help, "--canary"],
        });
      }
  
      if (flags.help.includes(Args[1])) {
        return HelpCommand({
          command: {
            alias: [keyWords.upgrade],
            description: "update trex",
          },
          flags: [
            { alias: flags.help, description: "show command help" },
            { alias: ["--canary"], description: "install from dev branch" },
          ],
        });
      }
  
      await updateTrex();
    } // * shows the dependency tree of a package
    else if (Args[0] === keyWords.tree) {
      if (flags.help.includes(Args[1])) {
        return HelpCommand({
          command: {
            alias: [keyWords.tree],
            description: "view dependency tree",
          },
          flags: [{ alias: flags.help, description: "show command help" }],
        });
      }
  
      if (!Args[1]) {
        throw new Error(red("you need to pass a package name")).message;
      }
  
      await packageTreeInfo(...Args);
    } // * run script aliases
    else if (Args[0] === keyWords.run) {
      if (flags.help.includes(Args[1])) {
        return HelpCommand({
          command: {
            alias: [keyWords.run],
            description: "run a script alias in a file run.json",
          },
          flags: [
            { alias: flags.help, description: "show command help" },
            {
              alias: ["--watch", "-w"],
              description: "use reboot script alias protocol (rsap)",
            },
            {
              alias: ["-wv"],
              description: "verbose output in --watch mode (rsap)",
            },
          ],
        });
      }
  
      // ignore '--watch' and '-w' in injected args
      const runArgs = Args[2]?.match(/^(--watch|-w|-wv)$/)
        ? Args.slice(3)
        : Args.slice(2);
  
      await Run(Args[1], runArgs);
    } // * purge command
    else if (Args[0] === keyWords.purge) {
      if (flags.help.includes(Args[1])) {
        HelpCommand({
          command: {
            alias: [keyWords.purge],
            description: "remove a package or url from cache",
          },
          flags: [
            {
              alias: flags.help,
              description: "show command help",
            },
          ],
        });
      }
  
      await purge();
    } // * ls command
    else if (Args[0] === keyWords.ls) {
      if (flags.help.includes(Args[1])) {
        HelpCommand({
          command: {
            alias: [keyWords.ls],
            description: "shows the list of installed packages",
          },
          flags: [
            {
              alias: flags.help,
              description: "show command help",
            },
          ],
        });
      } else {
        const map = (await getImportMap<importMap>())!;
        LogPackages(map?.imports, false);
      }
    } // * execute a cli with out install
    else if (Args[0] === keyWords.exec) {
      if (flags.help.includes(Args[1])) {
        HelpCommand({
          command: {
            alias: [keyWords.exec],
            description: "execute a cli tool with out install then",
          },
          flags: [
            {
              alias: flags.help,
              description: "show command help",
            },
            {
              alias: ["--perms"],
              description: "specify cli permisions",
            },
          ],
        });
      } else {
        await execution();
      }
    } // * check deno.land updates
    else if (Args[0] === keyWords.check) {
      if (flags.help.includes(Args[1])) {
        HelpCommand({
          command: {
            alias: [keyWords.check],
            description: "check deno.land [std/x] dependencies updates",
          },
          flags: [
            {
              alias: flags.help,
              description: "show command help",
            },
            {
              alias: flags.fix,
              description: "update outdate dependencies",
            },
          ],
        });
      } else {
        await checkDepsUpdates();
      }
    } // * set globals config
    else if (Args[0] === keyWords.globalConfig) {
      if (flags.help.includes(Args[1])) {
        HelpCommand({
          command: {
            alias: [keyWords.globalConfig],
            description: "set and get global configurations",
          },
          flags: [
            {
              alias: ["--importMap="],
              description: "set import map default name",
            },
            {
              alias: ["--getImportMap"],
              description: "get current import map name configuration",
            },
          ],
        });
      } else {
        const flag = Args[1].trim();
  
        if (/(--importMap=\w*).(\w*)/gim.test(flag)) {
          const [, value] = flag.split("=");
  
          Config.setConfig("importMap", value.trim());
        } else if (/--getImportMap/) {
          console.log(Config.getConfig("importMap"));
        }
      }
    } // * displays help information
    else {
      return CommandNotFound({
        commands: [
          keyWords.purge,
          keyWords.run,
          keyWords.tree,
          ...keyWords.install,
          keyWords.uninstall,
          keyWords.upgrade,
          ...flags.help,
          ...flags.version,
          keyWords.setup,
          keyWords.ls,
          keyWords.exec,
          keyWords.check,
          keyWords.globalConfig,
        ],
        flags: [],
      });
    }
  } catch (error) {
    console.error(error)
  }
}

if (import.meta.main) {
  await Main();
}
