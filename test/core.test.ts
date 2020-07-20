import { DeleteCacheModule, canDelete, getPath } from "../handlers/handle_delete_package.ts";
import { installPackages, customPackage } from "../handlers/handle_packages.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { showImportDeps, packageTreeInfo } from "../tools/logs.ts";
import { delay } from "https://deno.land/std/async/delay.ts";
import { LockFile } from "../handlers/handle_lock_file.ts";
import exec from "../tools/install_tools.ts";
import dbTool from "../tools/database.ts";

// * Install Package from denoland
Deno.test({
  name: "Install Package #1",

  fn: async () => {
    await delay(1000);
    const response = await installPackages(["i", "--map", "oak"]);
    assertEquals(response, { oak: "https://deno.land/x/oak/mod.ts" });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// * install package from nest.land
Deno.test({
  name: "Install Package #2",

  fn: async () => {
    await delay(1000);
    const response = await installPackages(["i", "--nest", "importql@0.1.0 "]);
    assertEquals(response, {
      importql:
        "https://arweave.net/F8armYyxSykulJmJ3kx1KzLh40VDCzEa_OQjUnpnsqo/mod.ts",
    });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Install custom package #1",

  fn: async () => {
    await delay(1000);
    const response = await customPackage(
      ...["--custom", "React=https://dev.jspm.io/react/index.js"]
    );
    assertEquals(response, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Lock File Trex.ts",

  fn: async () => {
    const input = ["--unstable", "--lock", "cli.ts"];
    await delay(1000);
    const response = await LockFile(...input);
    assertEquals(response, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Install Tool #1",

  fn: async () => {
    await delay(1000);
    const response = await exec({ config: dbTool["dpm"] });
    assertEquals(response, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


//* Trex --deps test
Deno.test({
  name: "Show deps of the import maps #1",

  fn: async () => {
    await delay(1000);
    const response = await showImportDeps() ;
    assertEquals(response, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


Deno.test({
  name: "Trex treeDeps test #1",

  fn: async () => {
    await delay(1000);
    const response = await packageTreeInfo(...["treeDeps", "oak"]) ;
    assertEquals(response, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Can Delete Package #1",

  fn: async () => {
    const user = (Deno.build.os === "windows"
      ? Deno.env.get("USERNAME")
      : Deno.env.get("HOME")) as string;

    await delay(1000);
    const response = await canDelete("oak");
    assertEquals(response, getPath(user, "oak"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Delete package #1",

  fn: async () => {
    await delay(1000);
    const response = await DeleteCacheModule("oak");
    assertEquals(response, undefined);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Delete package #2",

  fn: async () => {
    await delay(1000);
    const response = await DeleteCacheModule("importql");
    assertEquals(response, undefined);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
