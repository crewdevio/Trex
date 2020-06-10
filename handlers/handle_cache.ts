import { STD } from "../utils/info.ts";
import { green } from "https://deno.land/std/fmt/colors.ts";

import db from "../utils/db.ts";

type OS = "darwin" | "linux" | "windows";

async function cached(typePkg: string, packageUrl: string, sys: OS) {
  let process: Deno.Process;
  let DirOs: string;

  // * windows dir
  if (sys === "windows") {
    DirOs = "C:/ProgramData";
  }
  // * linux dir
  else if (sys === "linux") {
    DirOs = "opt/";
  }
  // * macOs dir
  else if (sys === "darwin") {
    DirOs = "/library";
  }

  // * by default use deno root dir
  else {
    DirOs = Deno.execPath();
  }

  console.log(green("cache package... \n"));
  // *
  if (STD.includes(typePkg) && db.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "--root",
        DirOs,
        "--unstable",
        packageUrl + "mod.ts",
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
        "--root",
        DirOs,
        "--unstable",
        packageUrl + "mod.ts",
      ],
    });

    await process.status();
    console.log(green("\n Done \n"));
  }
  // * install third party package
  else if (db.includes(typePkg)) {
    process = Deno.run({
      cmd: ["deno", "install", "-f", "--root", DirOs, "--unstable", packageUrl],
    });

    await process.status();
    console.log(green("\n Done \n"));
  }
  // * throw error if package is not found
  else if (!STD.includes(typePkg) && !db.includes(typePkg)) {
    throw new TypeError("package not found");
  }
}

export default cached;
