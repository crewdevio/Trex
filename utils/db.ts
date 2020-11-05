/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { pkgResponse } from "./types.ts";
import { offLine } from "./logs.ts";

export async function denoApidb(query: string) {
  // * get all thirt party
  const response = (await fetch(
    `https://api.deno.land/modules?limit=100&query=${query}`
  ).catch((_) => offLine())) as Response;

  const database = await response.json();

  if (database?.success) {
    return database?.data?.results.filter(
      ({ name }: pkgResponse) => name === query
    ) as Array<pkgResponse>;
  }

    return [];
}
