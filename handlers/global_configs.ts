/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { readJson } from "writeJson";
import { exists } from "exist";
import { join } from "path/mod.ts";

const defaults = Object.freeze({
  configFileRoute: join(Deno.cwd(), "trex.config.json"),
  importMap: "import_map.json",
});

type GetKeys<T extends {}> = T;
type Keys = GetKeys<keyof typeof defaults>;

const validateKey = (key: Keys) => !Object.keys(defaults).includes(key);

/**
 * manage globals
 */
async function globals() {
  const prefix = "trex.global.config=";
  const storage = window.localStorage;
  const local = { ...defaults };

  const path = join(local.configFileRoute);
  const existConfig = await exists(path);

  // if exist a config file, get all configs
  if (existConfig) {
    const config = (await readJson(path)) as { [key: string]: string };
    const keys = Object.keys(config).map((key) => key.trim());

    if (keys.includes("importMap")) {
      local["importMap"] = config["importMap"];
    }
  }

  return {
    setConfig(config: Keys, value: string) {
      if (validateKey(config)) {
        throw new Error("jose").message;
      }

      return storage.setItem(`${prefix}${config}`, value);
    },
    getConfig(config: Keys) {
      return existConfig
        ? local[config]
        : storage.getItem(`${prefix}${config}`)?.trim() ?? local[config];
    },
  };
}

export const Config = await globals();
