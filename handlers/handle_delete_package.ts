import { red, green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { STD } from "../utils/info.ts";

const { env, removeSync, build } = Deno;

export function haveVersion(module: string) {

  if (module.includes("@")) {
    return module.split("@")[0];
  }

  else {
    return module;
  }
}

// * return std version
function Version(module: string) {
  return module.includes("@") ? "@" + module.split("@")[1] : "";
}

// * return module name only
function Name(module: string) {
  return module.includes("@") ? module.split("@")[0] : module;
}

function existModule(user: string, module: string) {
  if (Deno.build.os === "windows") {
    // * for std modules
    if (STD.includes(haveVersion(module))) {
      return existsSync(
        `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/std${Version(
          module
        )}/${Name(module)}`
      );
    }

    // * deno.land/x modules
    else {
      return existsSync(
        `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/x/${module}`
      );
    }
  }

  else {
    // * for std modules
    if (STD.includes(haveVersion(module))) {
      return existsSync(
        `${user}/.cache/deno/gen/https/deno.land/std${Version(
          module
        )}/${Name(module)}`
      );
    }

    // * deno.land/x modules
    else {
      return existsSync(`${user}/.cache/deno/gen/https/deno.land/x/${module}`);
    }
  }
}
// * return module path to delete
export function getPath(user: string, module: string) {
  if (Deno.build.os === "windows") {

    if (STD.includes(haveVersion(module))) {
      return `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/std${Version(
        module
      )}/${Name(module)}`;
    }

    else {
      return `C:/Users/${user}/AppData/Local/deno/gen/https/deno.land/x/${module}`;
    }
  }

  else {

    if (STD.includes(haveVersion(module))) {
      return `${user}/.cache/deno/gen/https/deno.land/std${Version(
        module
      )}/${Name(module)}`;
    }

    else {
      return `${user}/.cache/deno/gen/https/deno.land/x/${module}`;
    }
  }
}
// * if can delete return module path dir
export function canDelete(module: string) {
  const user = (build.os === "windows"
    ? env.get("USERNAME")
    : env.get("HOME")) as string;

  if (existModule(user, module)) {

    return getPath(user, module);
  }

  else {
    console.error(
      red(
        "it was not removed from the cache because it is not a standard module or deno.land/x or it is not installed."
      )
    );
    return false;
  }
}

export function DeleteCacheModule(module: string) {
  try {
    if (canDelete(module)) {
      const path = canDelete(module) as string;
      removeSync(path, { recursive: true });
      console.log(green(yellow(module + ":") + " deleted from cache."));
    }
  }
  catch (error) {
    console.error(red(error));
  }
}
