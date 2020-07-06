import { getImportMap } from "../handlers/handle_files.ts";
import { Somebybroken } from "../utils/logs.ts";
import { importMap } from "../utils/types.ts";
import { needProxy, Proxy } from "../deps.ts";
import { STD } from "../utils/info.ts";

/**
 * show in console all the deps in the import map
 * @returns {boolean} return process state
 */

export async function showImportDeps(): Promise<boolean> {
  const process = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-read",
      "--allow-net",
      "--unstable",
      "https://deno.land/x/trex/tools/CheckUpdatesDeps/main.ts",
      "-f",
      "import_map.json",
    ],

    stdout: "piped",
  });
  const decoder = new TextDecoder("utf-8");

  const out = await process.output();
  console.log(decoder.decode(out));
  return (await process.status()).success;
}

/**
 * show in console the tree dependencies of a module
 * @param {string[]} ...args The Deno arguments pass in the console
 * @returns {boolean} return process state or throw a message with an error
 */

export async function packageTreeInfo(...args:string[]){
    try {

        const map: importMap = JSON.parse(getImportMap());

        for (const pkg in map?.imports) {
          if (STD.includes(args[1])) {
            const moduleName = args[1] + '/';

            if (moduleName === pkg) {

              const _pkg = needProxy(args[1])
                ? Proxy(args[1])
                : map.imports[pkg] + "mod.ts";

              const process = Deno.run({
                cmd: ["deno", "info", _pkg]
              });

              if (!(await process.status()).success) {
                Somebybroken();
              }
              return (await process.status()).success
            }
          }

          else {
            const moduleName = args[1];

            if (moduleName === pkg) {
              const process = Deno.run({
                cmd: ["deno", "info", map.imports[pkg]]
              });

              if (!(await process.status()).success) {
                Somebybroken();
              }
              return (await process.status()).success
            }
          }
        }
       }

        catch (_) {
          throw new Error(_).message;
        }
}