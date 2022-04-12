/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { exists } from "../temp_deps/exist.ts";
import { runJson } from "../utils/types.ts";
import * as yaml from "encoding/yaml.ts";

/**
 * parse .yaml file to javascript json
 */
export async function parseToYaml() {
  try {
    let runFile = {};
    let YAMLFile;

    const decoder = new TextDecoder("utf8");

    if (await exists("./run.yaml")) {
      YAMLFile = "./run.yaml";
    } else if (await exists("./run.yml")) {
      YAMLFile = "./run.yml";
    } else {
      return;
    }

    const data = await Deno.readFile(YAMLFile);

    (yaml.parse(decoder.decode(data)) as runJson[])?.forEach((object) => {
      runFile = { ...runFile, ...object };
    });

    return runFile as runJson;
  } catch (err) {
    console.error(err.message);
  }
}
