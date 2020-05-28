import { green, cyan } from "https://deno.land/std/fmt/colors.ts";

export function Version(version: string) {
  console.log(green(version), cyan("༼ つ ◕_◕ ༽つ"));
}

export function LogHelp(helpsInfo: string[]) {
  console.group(cyan("help:"));
  for (const info of helpsInfo) {
    console.log(info);
  }
  console.groupEnd();
}
