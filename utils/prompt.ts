/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * a simple STDIN and STDOUT
 * @param {string} message A message input what will be show in the console
 * @returns {Promise<string>} output the answer of the input
 */
export async function prompt(message: string) {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(message + ": "));
  const n = <number>await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}
