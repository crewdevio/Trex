import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { delay } from "https://deno.land/std/async/delay.ts";
import exec from "../tools/install_tools.ts";
import dbTool from "../tools/database.ts";

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
