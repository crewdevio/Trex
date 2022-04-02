/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * kill open process after end all process.
 */
export function KillProcess(process: Deno.ResourceMap) {
  const allProcess = Object.entries(process);

  allProcess.forEach((typeProcess) => {
    if (typeProcess[1] !== "stdin" && typeProcess[1] !== "stdout") {
      Deno.close(Number(typeProcess[0]));
    }
  });
}
