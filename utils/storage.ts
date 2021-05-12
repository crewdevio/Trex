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

/**
 * create a persistent json storage per CWD.
 */
export async function JsonStorage() {
  const hash = createHash("sha256").update(Deno.cwd()).toString();

  const storagePath =
    Deno.build.os === "windows"
      ? join("C:", "Users", Deno.env.get("USERNAME")!, ".deno","trex_storage\\")
      : join(Deno.env.get("HOME")!, ".deno", "trex_storage/");

  const currentStorage = join(storagePath, `${hash}.json`);

  if (!(await exists(storagePath))) await Deno.mkdir(storagePath);

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
      return await Deno.remove(currentStorage, { recursive: true });
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
