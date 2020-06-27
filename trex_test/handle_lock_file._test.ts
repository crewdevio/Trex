import { LockFile } from "../handlers/handle_lock_file.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { delay } from "https://deno.land/std/async/delay.ts";


Deno.test({
    name: "Lock File Trex.ts",

    fn: async () =>{
        const input = ["--lock", "Trex.ts"]
        await delay(1000)
        const response = await LockFile(...input)
        assertEquals(response, true)
    },
    sanitizeResources: false,
    sanitizeOps: false
});
