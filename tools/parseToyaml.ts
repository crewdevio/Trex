/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { yaml } from "../imports/encoding.ts";
import { exists } from "../imports/fs.ts";
import { runJson } from "../utils/types.ts";

/**
 * parse .yaml file to javascript json
 */
export async function parseToYaml() {
  try {
    let runFile = {};
    let YAMLFile;

    const decoder = new TextDecoder("utf8");

    if (await exists("./run.yaml")) {
      YAMLFile = "./run.yaml"
    } else {
      YAMLFile = "./run.yml"
    }

    const data = await Deno.readFile(YAMLFile);

    (yaml.parse(decoder.decode(data)) as runJson[])?.forEach((object) => {
      runFile = { ...runFile, ...object };
    });

    return runFile as runJson;
  }
  catch (err) {
    console.error(err.message);
  }
}
