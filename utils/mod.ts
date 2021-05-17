/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Fn } from "./types.ts";

/**
 * match multiple cases
 */
export function Match<T extends any>(data: T) {
  const cases: Array<{ condition: T | any; action?: Fn }> = [];
  let once = true;

  return {
    case(condition: T, action: Fn) {
      cases.push({ condition, action });
      return this;
    },
    default(action?: Fn) {
      if (once) {
        cases.push({ condition: "DEFAULT", action });
        once = false;
      }

      return {
        Value() {
          const value = cases
            .map(({ action, condition }) => {
              if (condition === data) {
                return action?.();
              }
            })
            .filter((val) => val);

          const none = cases.filter(({ condition }) => condition === "DEFAULT");

          return value.length
            ? value.shift()
            : none.shift()?.action?.() ?? null;
        },
      };
    },
  };
}
