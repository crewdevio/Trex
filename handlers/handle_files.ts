/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const { writeFileSync, mkdir } = Deno;

export async function createFolder() {
  await mkdir("imports");
}

export function WriteImport(name: string, url: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`export * from "${url}";`);
  writeFileSync(`./imports/${name}.ts`, data);
}
