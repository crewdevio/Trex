/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readJson, writeJson } from "../temp_deps/writeJson.ts";
import type { DefaultStore } from "./types.ts";
import { createHash } from "hash/mod.ts";
import { exists } from "fs/mod.ts";
import { join } from "path/mod.ts";

const { env, remove, mkdir, build } = Deno;
const commonDir = "trex_storage";

/**
 * detect if is runnig on gh action workflow
 */
export const isGH = !!env.get("GITHUB_ACTIONS")! ||
  !!env.get("GITHUB_WORKFLOW")! ||
  !!env.get("GITHUB_JOB")!;

/**
 * github actions fallback storage path
 */
const ghFallBack = join(Deno.cwd(), commonDir);

/**
 * create a persistent json storage per CWD.
 */
export async function JsonStorage() {
  const hash = createHash("sha256").update(Deno.cwd()).toString();

  const linuxHome = join(env.get("HOME")!, ".deno", `${commonDir}/`);
  
  const storagePath = isGH
    ? ghFallBack
    : build.os === "windows"
    ? join("C:", "Users", env.get("USERNAME")!, ".deno", `${commonDir}\\`)
    : (await exists(linuxHome))
    ? join(env.get("DENO_DIR")!, "../", "../", `${commonDir}/`)
    : linuxHome;

  const currentStorage = join(storagePath, `${hash}.json`);

  if (!(await exists(storagePath))) await mkdir(storagePath);

  if (!(await exists(currentStorage))) {
    await writeJson(currentStorage, {}, { spaces: 2, create: true });
  }

  return {
    async getStorage<T extends any>(): Promise<T> {
      if (await exists(currentStorage)) {
        return (await readJson(currentStorage)) as T;
      }

      throw new Error("storage was removed").message;
    },
    async getItem<T extends any>(item: string): Promise<T> {
      if (await exists(currentStorage)) {
        const store = (await readJson(currentStorage)) as DefaultStore;

        return store[item] as T;
      }

      throw new Error("storage was removed").message;
    },
    async setItem(item: string, value: any) {
      if (await exists(currentStorage)) {
        const store = (await readJson(currentStorage)) as DefaultStore;
        store[item] = value;

        return await writeJson(currentStorage, store, {
          create: false,
          spaces: 2,
        });
      }

      throw new Error("storage was removed").message;
    },
    async has(item: string): Promise<boolean> {
      if (await exists(currentStorage)) {
        const store = (await readJson(currentStorage)) as DefaultStore;

        return Object.keys(store).includes(item);
      }

      throw new Error("storage was removed").message;
    },
    async dropStorage() {
      return await remove(currentStorage, { recursive: true });
    },
    async deleteItem(item: string) {
      if (await exists(currentStorage)) {
        const store = (await readJson(currentStorage)) as DefaultStore;
        delete store[item];

        return await writeJson(currentStorage, store, {
          create: false,
          spaces: 2,
        });
      }

      throw new Error("storage was removed").message;
    },
  };
}
