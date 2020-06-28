import { DeleteCacheModule, canDelete, getPath } from "../handlers/handle_delete_package.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { installPakages, customPackage } from "../handlers/handle_packages.ts";
import { delay } from "https://deno.land/std/async/delay.ts";

// * Install Package from denoland
Deno.test({
  name: "Install Package #1",

  fn: async () => {
    await delay(1000);
    const response = await installPakages(["i", "--map", "oak"]);
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
    const response = await installPakages(["i", "--nest", "importql@0.1.0 "]);
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
    const response = await customPackage(...[ "--custom", "React=https://dev.jspm.io/react/index.js" ]);
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
