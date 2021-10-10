/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Fn } from "./types.ts";

/**
 * match multiple cases
 */
export function Match<T extends any>(data: T) {
  const cases: Array<{ condition: T | any; action?: Fn }> = [];
  let once = true;

  return {
    case(condition: T, action: Fn) {
      cases.push({ condition, action });
      return this;
    },
    default(action?: Fn) {
      if (once) {
        cases.push({ condition: "DEFAULT", action });
        once = false;
      }

      return {
        Value() {
          const value = cases
            .map(({ action, condition }) => {
              if (condition === data) {
                return action?.();
              }
            })
            .filter((val) => val);

          const none = cases.filter(({ condition }) => condition === "DEFAULT");

          return value.length
            ? value.shift()
            : none.shift()?.action?.() ?? null;
        },
      };
    },
  };
}

/**
 * resolve main download file
 */
export async function getMainFile(name: string, version?: string) {
  // * filter a array promises
  async function filter<T extends any>(
    arr: Array<T>,
    callback: (item: T) => Promise<boolean>,
  ) {
    const fail = Symbol();

    return (
      await Promise.all(
        arr.map(async (item) => ((await callback(item)) ? item : fail)),
      )
    ).filter((item) => item !== fail);
  }

  const files = [
    "mod.ts",
    "mod.js",
    "index.js",
    "index.ts",
    "%name%.js",
    "%name%.ts",
    "dist/index.esm.js",
    "dist/index.esm.min.js",
    "dist/%name%.esm.js",
    "dist/%name%.esm.min.js",
    "dist/mod.ts",
    "dist/mod.js",
    "dist/index.js",
    "dist/%name%.js",
    "dist/%name%.min.js",
    "lib/index.ts",
    "lib/index.js",
    "lib/%name%.ts",
    "lib/%name%.js",
    "deno/index.ts",
    "deno/index.js",
  ].map(async (target) => {
    const file = target.includes("%name%")
      ? target.replace("%name%", name?.trim())
      : target;

    const response = await fetch(
      `https://deno.land/x/${name}${version ? `@${version}` : ""}/${file}`,
    );

    const { ok, status } = response;

    return {
      file,
      ok,
      status,
    };
  });

  return (
    await filter(
      files,
      async (file) => (await file).ok && (await file).status < 300,
    )
  ).shift();
}
