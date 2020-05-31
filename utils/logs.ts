import { VERSION } from "./info.ts";
import exec from "../tools/install_tools.ts";
import { green, cyan } from "https://deno.land/std/fmt/colors.ts";

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
    "https://raw.githubusercontent.com/crewdevio/Trex/master/utils/trex_version.json"
  ); // * get the plain text
  const repoVersion: Object = await response.json();

  if (JSON.stringify(VERSION) !== JSON.stringify(repoVersion)) {
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
          url: "https://deno.land/x/trex/Trex.ts",
        },
      });
      console.log(repoVersion)
    }, 5000);
  } else {
    console.log(cyan("Trex is already update"));
  }
}
