import { STD } from "../utils/info.ts";
import { green } from "https://deno.land/std/fmt/colors.ts";

import db from "../utils/db.ts";

export default async function cached(typePkg: string, packageUrl: string) {
  let process: Deno.Process;
  console.log(green("cache package... \n"));

  if (STD.includes(typePkg) && db.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "--root",
        "C:/ProgramData",
        "--unstable",
        packageUrl + "mod.ts",
      ],
    });
  } else if (STD.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "--root",
        "C:/ProgramData",
        "--unstable",
        packageUrl + "mod.ts",
      ],
    });

    await process.status();
    console.log(green("\n Done \n"));
  } else if (db.includes(typePkg)) {
    process = Deno.run({
      cmd: [
        "deno",
        "install",
        "-f",
        "--root",
        "C:/ProgramData",
        "--unstable",
        packageUrl,
      ],
    });

    await process.status();
    console.log(green("\n Done \n"));
  } else if (!STD.includes(typePkg) && !db.includes(typePkg)) {
    throw new TypeError("package not found");
  }
}
