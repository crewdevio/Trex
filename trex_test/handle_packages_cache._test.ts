import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { installPakages } from "../handlers/handle_packages.ts";
import { delay } from "https://deno.land/std/async/delay.ts";
import { DeleteCacheModule, canDelete, haveVersion, getPath } from "../handlers/handle_delete_package.ts";

Deno.test({
    name: "Install Package #1",

    fn: async () =>{

        await delay(1000)
        const response = await installPakages(["i","--map","oak"])
        assertEquals(response, { oak: "https://deno.land/x/oak/mod.ts" })
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "Can Delete Package #1",

    fn: async () =>{
        const user = (Deno.build.os === "windows"
        ? Deno.env.get("USERNAME")
        : Deno.env.get("HOME")) as string;

        await delay(1000)
        const response = await canDelete("oak")
        assertEquals(response, getPath(user, "oak"))
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "Delete package #1",

    fn: async () =>{

        await delay(1000)
        const response = await DeleteCacheModule("oak")
        assertEquals(response, undefined)
    },
    sanitizeResources: false,
    sanitizeOps: false
});

