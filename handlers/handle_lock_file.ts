/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { errorsMessage } from "../utils/types.ts";
import { colors } from "../imports/fmt.ts";

/**
 * generate a lock file.
 * @param {string[]} args - input file to generate the lock file
 * @return {boolean} State of the process.
 */

export async function LockFile(...args: string[]) {
  const process = Deno.run({
    cmd: [
      "deno",
      "cache",
      "--unstable",
      "--lock=lock.json",
      "--lock-write",
      ...args,
    ],
  });

  if (!(await process.status()).success) {
    process.close();
    throw Error(
      colors.red(errorsMessage.lockFile)
      ).message;
  }

  console.log("|- ", colors.green("lock.json\ndone it."));
  return (await process.status()).success;
}
