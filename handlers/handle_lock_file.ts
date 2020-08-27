/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors } from "../imports/fmt.ts";

const { red, green } = colors;
/**
 * generate a lock file.
 * @param {string[]} args - input file to generate the lock file
 * @return {boolean} State of the process.
 */

export async function LockFile(...args: string[]) {
  const [_, importmap, file] = args;

  let conf: string[] = [file];

  if (file && importmap) {
    conf = ["--importmap=import_map.json", file];
  } else if (!file) {
    conf = [importmap];
  }

  const process = Deno.run({
    cmd: [
      "deno",
      "cache",
      "--unstable",
      "--lock=lock.json",
      "--lock-write",
      ...conf,
    ],
  });

  if (!(await process.status()).success) {
    process.close();
    throw Error(red("Error: creating lock.json file")).message;
  }

  console.log("|- ", green("lock.json\ndone it."));
  return (await process.status()).success;
}
