/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { yaml } from "../imports/encoding.ts";
import { runJson } from "../utils/types.ts";

/**
 * parse .yaml file to javascript json
 */
export async function parseToYaml() {
  try {
    let runFile = {};

    const decoder = new TextDecoder("utf8");

    const data = await Deno.readFile("./run.yaml");

    (yaml.parse(decoder.decode(data)) as runJson[])?.forEach((object) => {
      runFile = { ...runFile, ...object };
    });

    return runFile as runJson;
  }
  catch (err) {
    console.error(err.message);
  }
}
