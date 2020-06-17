import { red, green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { STD } from "../utils/info.ts";

const { env, removeSync, build } = Deno;

function existModule(user: string, module: string) {
  if (Deno.build.os === "windows") {
    return existsSync(
      `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/std/${module}`
    );
  } else {
    return existsSync(`${user}/.cache/deno/gen/https/deno.land/std/${module}`);
  }
}

function getPath(user: string, module: string) {
  if (Deno.build.os === "windows") {
    return `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/std/${module}`;
  } else {
    return `${user}/.cache/deno/gen/https/deno.land/std/${module}`;
  }
}

function deleteModule(module: string) {
  const user = (build.os === "windows"
    ? env.get("USERNAME")
    : env.get("HOME")) as string;

  if (STD.includes(module) && existModule(user, module)) {
    return getPath(user, module);
  } else {
    console.log(
      red("error this package not have installed or not is std module.")
    );
    return false;
  }
}

export function DeleteCacheModule(module: string) {
  try {
    if (deleteModule(module)) {
      const path = deleteModule(module) as string;
      removeSync(path, { recursive: true });
      console.log(green("Done " + yellow(module) + " delete."));
    }
  } catch (error) {
    console.log(red(error));
  }
}
