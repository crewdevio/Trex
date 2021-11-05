/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as colors from "fmt/colors.ts";

/**
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { yellow, green, blue } = colors;

export const leven = (left: string, right: string) => {
  const array: any[] = [];
  const charCodeCache: any[] = [];

  if (left === right) {
    return 0;
  }

  const swap = left;

  if (left.length > right.length) {
    left = right;
    right = swap;
  }

  let leftLength = left.length;
  let rightLength = right.length;

  while (
    leftLength > 0 &&
    left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength)
  ) {
    leftLength--;
    rightLength--;
  }

  let start = 0;

  while (
    start < leftLength &&
    left.charCodeAt(start) === right.charCodeAt(start)
  ) {
    start++;
  }

  leftLength -= start;
  rightLength -= start;

  if (leftLength === 0) {
    return rightLength;
  }

  let bCharCode;
  let result;
  let temp;
  let temp2;
  let i = 0;
  let j = 0;

  while (i < leftLength) {
    charCodeCache[i] = left.charCodeAt(start + i);
    array[i] = ++i;
  }

  while (j < rightLength) {
    bCharCode = right.charCodeAt(start + j);
    temp = j++;
    result = j;

    for (i = 0; i < leftLength; i++) {
      temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
      temp = array[i];

      result = array[i] = temp > result
        ? temp2 > result ? result + 1 : temp2
        : temp2 > temp
        ? temp + 1
        : temp2;
    }
  }

  return result;
};

/**
 * show spell suggestion
 * @param word
 * @param commands
 * @param command
 */
export const didYouMean = (word: string, commands: string[], command = "") => {
  const best = commands
    .filter((cmd) => leven(word, cmd) < word.length * 0.4)
    .map((str) => green(` trex ${yellow(command)} ${blue(str)}`));
  return best.length === 0
    ? ""
    : best.length === 1
    ? `\n ${yellow("Did you mean this?")}\n\n${best[0]}`
    : `\nDid you mean one of these?\n${best.slice(0, 3).join("\n")}\n`;
};
