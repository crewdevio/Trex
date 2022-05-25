import { customPackage, installPackages } from "../handlers/handle_packages.ts";
import { deletepackage } from "../handlers/delete_package.ts";
import { isCachePackage } from "../handlers/handle_cache.ts";
import { HelpCommand, LogPackages } from "../utils/logs.ts";
import { getImportMap } from "../handlers/handle_files.ts";
import { packageTreeInfo } from "../tools/logs.ts";
import { importMap } from "../utils/types.ts";
import { Merlin } from "merlin";

const Test = new Merlin();

Test.assertEqual("install custom package from raw github link", {
  async expect(): Promise<boolean> {
    const data = await customPackage(
      [
        "--custom",
        "merlin=https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts",
      ],
      false,
    );

    return data;
  },
  toBe(): boolean {
    return true;
  },
  Ops: false,
  Resources: false,
});

Test.assertEqual("install dinoenv@v1.1.0 package from deno.land", {
  async expect() {
    const pkg = await installPackages(["install", "--map", "dinoenv@v1.1.0"], false);
    return pkg;
  },
  toBe() {
    return { dinoenv: "https://deno.land/x/dinoenv@v1.1.0/mod.ts" };
  },
  Ops: false,
  Resources: false,
});

Test.assertEqual("install dinoenv package from nest.land", {
  async expect() {
    const pkg = await installPackages(["i", "--nest", "dinoenv@1.0.0"], false);

    return pkg;
  },
  toBe() {
    return {
      dinoenv:
        "https://arweave.net/Rru09TE8WVU_0eMY5lWAM6xsZxbVDScnqkrGvZPjEs4/mod.ts",
    };
  },
  Ops: false,
  Resources: false,
  ignore: true,
});

Test.isUndefined("trex treeDeps test", {
  async value() {
    return (await packageTreeInfo(
      ...["--unstable", "treeDeps", "react"],
    )) as undefined;
  },
  Ops: false,
  Resources: false,
});

Test.isUndefined("Command helper test", {
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
    });
  },
  Ops: false,
  Resources: false,
});

Test.assertEqual("is cache package", {
  async expect() {
    const data = await isCachePackage(
      "https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts",
    );

    return data.exist;
  },

  toBe() {
    return true;
  },
  Ops: false,
  Resources: false,
});

Test.isString("is cache package path", {
  async value() {
    const data = await isCachePackage(
      "https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts",
    );

    return data.path;
  },
  Ops: false,
  Resources: false,
});

Test.isUndefined("delete package", {
  async value() {
    const response = await deletepackage("merlin");

    return response;
  },
  // ignore: true,
  Ops: false,
  Resources: false,
});

Test.isUndefined("ls command", {
  async value() {
    const map = (await getImportMap<importMap>())!;
    return LogPackages(map?.imports, false);
  },
  Ops: false,
  Resources: false,
});
