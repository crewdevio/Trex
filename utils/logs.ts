import { VERSION } from "./info.ts";

import exec from "../tools/install_tools.ts";
import { cyan } from "https://deno.land/std/fmt/colors.ts";

import changeLog from "../tools/changeLog.ts";

export function Version(version: string) {
  console.log(version, cyan("༼ つ ◕_◕ ༽つ"));
}

export function LogHelp(helpsInfo: string[]) {
  console.group(cyan("help:"));
  for (const info of helpsInfo) {
    console.log(info);
  }
  console.groupEnd();
}

export async function updateTrex(): Promise<void> {
  //get the version of the repo in github
  const response = await fetch(
    "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/utils/version.json"
  ); // * get the plain text
  const repoVersion = (await response.json()) as { VERSION: string };

  if (repoVersion.VERSION !== VERSION.VERSION) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: [
            "-f",
            "--allow-read",
            "--allow-write",
            "--allow-net",
            "--allow-run",
            "--unstable",
          ],
          url:
            "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/Trex.ts",
        },
      });
      console.log(repoVersion);
      changeLog();
    }, 5000);
  } else {
    console.log(cyan("Trex is already update"));
  }
}
