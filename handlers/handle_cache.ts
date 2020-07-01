import { needProxy, Proxy } from "https://raw.githubusercontent.com/crewdevio/Trex/proxy/proxy/proxy.ts";
import { green, red } from "https://deno.land/std/fmt/colors.ts";
import { ErrorInstalling } from "../utils/logs.ts";
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

    if (!(await process.status()).success) {
      ErrorInstalling();
    }
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

    if (!(await process.status()).success) {
      ErrorInstalling();
    }

    console.log(green("\n Done. \n"));
  }

  // * install third party package
  else if (db.includes(typePkg)) {
    process = Deno.run({
      cmd: ["deno", "install", "-f", "-n", ID, "--unstable", packageUrl],
    });

    // * if cannot download module, throw error message
    if (!(await process.status()).success) {
      ErrorInstalling();
    }

    console.log(green("\n Done. \n"));
  }

  // * log error if package is not found
  else if (!STD.includes(typePkg) && !db.includes(typePkg)) {
    console.error(red("package not found"));
    return;
  }
}

export default cached;
