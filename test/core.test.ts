import { DeleteCacheModule, canDelete, getPath } from "../handlers/handle_delete_package.ts";
import { installPackages, customPackage } from "../handlers/handle_packages.ts";
import { Merlin } from "https://denopkg.com/crewdevio/merlin/mod.ts" ;
import { showImportDeps, packageTreeInfo } from "../tools/logs.ts";
import { delay } from "https://deno.land/std/async/delay.ts";
import { LockFile } from "../handlers/handle_lock_file.ts";
import exec from "../tools/install_tools.ts";
import dbTool from "../tools/database.ts";

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
    const pkg = await installPackages(["i", "--nest", "importql@0.1.0 "]);

    return pkg;
  },
  toBe() {
    return {
      importql:
        "https://arweave.net/F8armYyxSykulJmJ3kx1KzLh40VDCzEa_OQjUnpnsqo/mod.ts",
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

merlin.testEqual("install tool", {
  async expect() {
    await delay(1000);
    const data = await exec({
      config: dbTool["dpm"],
    });

    return true;
  },
  toBe() {
    return true;
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Lock File", {
  async expect() {
    return await LockFile(...["--unstable", "--lock", "cli.ts"]);
  },
  toBe() {
    return true;
  },
  Resources: false,
  Ops: false,
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

merlin.testEqual("Trex treeDeps test", {
  async expect() {
    return await packageTreeInfo(...["treeDeps", "oak"]);
  },
  toBe() {
    return undefined;
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Can Delete Package #1", {
  async expect() {
    return await canDelete("oak");
  },
  toBe() {
    const user = (Deno.build.os === "windows"
      ? Deno.env.get("USERNAME")
      : Deno.env.get("HOME")) as string;

    return getPath(user, "oak");
  },
});

merlin.testEqual("Delete package #1", {
  async expect() {
    return await DeleteCacheModule("oak");
  },
  toBe() {
    return undefined;
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Delete package #2", {
  async expect() {
    return await DeleteCacheModule("importql");
  },
  toBe() {
    return undefined;
  },
  Ops: false,
  Resources: false,
});
