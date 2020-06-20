import { green, red } from "https://deno.land/std/fmt/colors.ts";
import { needProxy, Proxy } from "../proxy/proxy.ts";
import { STD } from "../utils/info.ts";
import db from "../utils/db.ts";

async function cached(typePkg: string, packageUrl: string) {
  const ID = "Trex_Cache_Map";

  let process: Deno.Process;

  console.log(green("cache package... \n"));

  if (STD.includes(typePkg) && db.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(typePkg) ? Proxy(typePkg) : packageUrl + "mod.ts",
      ],
    });
  }
  // * install standar party package by defaul use mod.ts
  else if (STD.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "-n",
        ID,
        "--unstable",
        needProxy(typePkg) ? Proxy(typePkg) : packageUrl + "mod.ts",
      ],
    });

    await process.status();
    console.log(green("\n Done. \n"));
  }
  // * install third party package
  else if (db.includes(typePkg)) {
    process = Deno.run({
      cmd: ["deno", "install", "-f", "-n", ID, "--unstable", packageUrl],
    });

    await process.status();
    console.log(green("\n Done. \n"));
  }
  // * log error if package is not found
  else if (!STD.includes(typePkg) && !db.includes(typePkg)) {
    console.error(red("package not found"));
    return;
  }
}

export default cached;
