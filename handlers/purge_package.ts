/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Proxy, needProxy } from "proxy";
import type { importMap } from "../utils/types.ts";
import { isCachePackage } from "./handle_cache.ts";
import { getImportMap } from "./handle_files.ts";
import * as colors from "fmt/colors.ts";
import { STD } from "../utils/info.ts";

const { red, yellow, green } = colors;

const { args } = Deno;

/**
 * remove a package o url from cache memory
 */
export async function purge() {
  const [, pkgOrUrl] = args;

  const map = await getImportMap<importMap>();

  if (map) {
    // for url package
    if (pkgOrUrl.includes("http://") || pkgOrUrl.includes("https://")) {
      const data = await isCachePackage(pkgOrUrl);

      if (!data.exist) {
        throw new Error(red("this package was not found in the cache")).message;
      }

      try {
        await Deno.remove(data.path, { recursive: true });
        console.log(
          green(`${yellow(pkgOrUrl)} package was removed from cache`)
        );
      } catch (err) {
        throw new Error(red(err.message)).message;
      }
    }

    // for import map package
    else if (pkgOrUrl in map?.imports) {
      const pkg = pkgOrUrl.replace("/", "");
      let url = needProxy(pkg) ? Proxy(pkg) : map?.imports[pkgOrUrl]!;

      // if is a std package
      if (STD.includes(pkg) && !(url.endsWith(".js") || url.endsWith(".ts"))) {
        url += "mod.ts";
      }

      const data = await isCachePackage(url);

      if (!data.exist) {
        throw new Error(red("this package was not found in the cache")).message;
      }

      try {
        await Deno.remove(data.path, { recursive: true });
        console.log(
          green(`${yellow(pkgOrUrl)} package was removed from cache`)
        );
      } catch (err) {
        throw new Error(red(err.message)).message;
      }
    }
  }

  // display error
  else {
    if (!["--help", "-h"].includes(pkgOrUrl)) {
      throw new Error(
        red(`package ${yellow(pkgOrUrl)} was not found in import map file `)
      ).message;
    }
  }
}
