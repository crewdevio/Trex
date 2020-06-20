import { cyan } from "https://deno.land/std/fmt/colors.ts";
import exec from "../tools/install_tools.ts";
import { VERSION } from "./info.ts";

export function Version(version: string) {
  console.log(version, cyan("༼ つ ◕_◕ ༽つ"));
}

export function LogHelp(helpsInfo: string[]) {
  for (const info of helpsInfo) {
    console.log(info);
  }
}

export async function updateTrex(): Promise<void> {
  // * get the version of the repo in github
  const response = await fetch(
    "https://raw.githubusercontent.com/crewdevio/Trex/master/utils/version.json"
  ); // * get the plain text
  const repoVersion = (await response.json()) as { VERSION: string };

  if (repoVersion.VERSION !== VERSION.VERSION) {
    setTimeout(async () => {
      await exec({
        config: {
          permissions: [
            "-f",
            "-A",
            "--unstable",
          ],
          url: "https://deno.land/x/trex/Trex.ts",
        },
      });
      console.log(repoVersion.VERSION);
    }, 5000);
  } else {
    console.log(cyan("Trex is already update"));
  }
}
