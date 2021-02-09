import { installPackages, customPackage } from "../handlers/handle_packages.ts";
import { deletepackage } from "../handlers/delete_package.ts";
import { isCachePackage } from "../handlers/handle_cache.ts";
import { HelpCommand, LogPackages } from "../utils/logs.ts";
import { getImportMap } from "../handlers/handle_files.ts";
import { packageTreeInfo } from "../tools/logs.ts";
import { setupIDE } from "../tools/setup_ide.ts";
import { Merlin } from "../imports/merlin.ts";

const merlin = new Merlin();

merlin.assertEqual("install custom package", {
  async expect() {
    const data = await customPackage(
      ...[
        "--custom",
        "merlin=https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts",
      ]
    );

    return data;
  },
  toBe() {
    return true;
  },
  Ops: false,
  Resources: false,
  ignore: false
});

merlin.assertEqual("install package from deno.land", {
  async expect() {
    const pkg = await installPackages(["i", "--map", "oak"]);

    return pkg;
  },
  toBe() {
    return { oak: "https://deno.land/x/oak/mod.ts" };
  },
  Ops: false,
  Resources: false,
});

merlin.assertEqual("install package from nest.land", {
  async expect() {
    const pkg = await installPackages(["i", "--nest", "dinoenv@1.0.0"]);

    return pkg;
  },
  toBe() {
    return {
      dinoenv:
        "https://arweave.net/Rru09TE8WVU_0eMY5lWAM6xsZxbVDScnqkrGvZPjEs4/mod.ts",
    };
  },
});

merlin.isUndefined("trex treeDeps test", {
  async value() {
    return (await packageTreeInfo(
      ...["--unstable", "treeDeps", "react"]
    )) as undefined;
  },
});

merlin.isUndefined("Setup IDE", {
  async value() {
    return (await setupIDE("--vscode")) as undefined;
  },
  ignore: true,
});

merlin.isUndefined("Command helper test", {
  value() {
    return HelpCommand({
      command: {
        alias: ["install", "i"],
        description: "install a package",
      },
      flags: [
        {
          alias: ["--map", "-m"],
          description: "install package from deno.land",
        },
        {
          alias: ["--nest", "-n"],
          description: "install package from nest.land",
        },
        {
          alias: ["--pkg", "-p"],
          description: "install package from some repository",
        },
        { alias: ["--help, -h"], description: "show command help" },
      ],
    }) as undefined;
  },
});

merlin.assertEqual("is cache package", {
  async expect() {
    const data = await isCachePackage(
      "https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts"
    );

    return data.exist;
  },

  toBe() {
    return true;
  },
});

merlin.isString("is cache package path", {
  async value() {
    const data = await isCachePackage(
      "https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts"
    );

    return data.path;
  },
});

merlin.isUndefined("delete package", {
  async value() {
    const response = await deletepackage("merlin");

    return response as undefined;
  },
  // ignore: true,
  Ops: false,
  Resources: false
});

merlin.isUndefined("ls command", {
  async value() {
    return LogPackages(await getImportMap(), true) as undefined;
  },
});
