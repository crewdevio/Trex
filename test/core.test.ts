import { DeleteCacheModule, canDelete, getPath } from "../handlers/handle_delete_package.ts";
import { installPackages, customPackage } from "../handlers/handle_packages.ts";
import { Merlin } from "https://denopkg.com/crewdevio/merlin/mod.ts" ;
import { showImportDeps, packageTreeInfo } from "../tools/logs.ts";
import { LockFile } from "../handlers/handle_lock_file.ts";

const merlin = new Merlin();

merlin.testEqual("install package from deno.land", {
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

merlin.testEqual("install package from nest.land", {
  async expect() {
    const pkg = await installPackages(["i", "--nest", "dinoenv@1.0.0"]);

    return pkg;
  },
  toBe() {
    return {
      dinoenv:
        "https://arweave.net/Rru09TE8WVU_0eMY5lWAM6xsZxbVDScnqkrGvZPjEs4/mod.ts"
    };
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("install custom package", {
  async expect() {
    const data = await customPackage(
      ...["--custom", "React=https://dev.jspm.io/react/index.js"]
    );

    return data;
  },
  toBe() {
    return true;
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Show deps of the import maps", {
  async expect() {
    return await showImportDeps();
  },
  toBe() {
    return true;
  },
  Resources: false,
  Ops: false,
});

merlin.testEqual("Can Delete Package #1", {
  async expect() {
    return await canDelete("oak");
  },
  toBe() {
    return false;
  },
  Ops: false,
  Resources: false
});

merlin.isUndefined("Delete package #1", {
  async value() {
    return await DeleteCacheModule("oak");
  },
  Ops: false,
  Resources: false,
});

merlin.isUndefined("Delete package #2", {
  async value() {
    return await DeleteCacheModule("importql");
  },
  Ops: false,
  Resources: false,
});

merlin.isUndefined("Trex treeDeps test", {
  async value() {
    return await packageTreeInfo(...["treeDeps", "React"]);
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Lock File", {
  async expect() {
    return await LockFile(...["--unstable", "--lock", "./cli.ts"]);
  },
  toBe() {
    return true;
  },
  Resources: false,
  Ops: false,
});
