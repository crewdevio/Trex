import { installPackages, customPackage } from "../handlers/handle_packages.ts";
import { Merlin } from "https://denopkg.com/crewdevio/merlin/mod.ts";
import { LockFile } from "../handlers/handle_lock_file.ts";
import { packageTreeInfo } from "../tools/logs.ts";

const merlin = new Merlin();

merlin.testEqual("install custom package", {
  async expect() {
    const data = await customPackage(
      ...["--custom", "merlin=http://denopkg.com/crewdevio/merlin/mod.ts"]
    );

    return data;
  },
  toBe() {
    return true;
  },
  Ops: false,
  Resources: false,
});

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
        "https://arweave.net/Rru09TE8WVU_0eMY5lWAM6xsZxbVDScnqkrGvZPjEs4/mod.ts",
    };
  },
  Ops: false,
  Resources: false,
});

merlin.testEqual("Lock File", {
  async expect() {
    return await LockFile(...["--lock", "./test/core.test.ts"]);
  },
  toBe() {
    return true;
  },
  Resources: false,
  Ops: false,
});

merlin.isUndefined("Trex treeDeps test", {
  async value() {
    return await packageTreeInfo(...["--unstable", "treeDeps", "react"]);
  },
  Ops: false,
  Resources: false,
});
