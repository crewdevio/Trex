/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Params } from "../utils/types.ts";
import { Somebybroken } from "../utils/logs.ts";

function installTools(args: string[]) {
  return Deno.run({ cmd: ["deno", ...args], stdout: "piped" });
}

/*
 * install script from database.json
 */

export default async function exec(param: Params): Promise<boolean> {
  const args: string[] = [
    "install",
    "-f",
    ...param.config.permissions,
    param.config.url,
  ];

  const app: Deno.Process = installTools(args);
  const decoder = new TextDecoder("utf-8");

  const out = await app.output();
  console.log(decoder.decode(out));
  const response = (await app.status()).success;

  if (!response) {
    app.close();
    Somebybroken("something went wrong in the installation");
  }

  return response;
}
