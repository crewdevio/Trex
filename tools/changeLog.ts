import { readJsonSync } from "https://deno.land/std/fs/mod.ts";
import { green } from "https://deno.land/std/fmt/colors.ts";

function changeLog() {
  const changelog = readJsonSync(Deno.cwd() + "/changeLog.json") as {
    message: string[];
  };

  console.log("\n changeLog: \n");
  for (const change of changelog?.message) {
    console.log(green(change + "\n"));
  }
}

export default changeLog;
