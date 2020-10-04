/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type objectGen = { [key: string]: string };
export type proxyPkg = { module: string; url: string };

export interface importMap {
  imports: objectGen;
}

export interface Params {
  config: {
    permissions: string[];
    url: string;
  };
}

export interface NestResponse {
  name: string;

  package: {
    name: string;
    owner: string;
    description: string;
    createdAt: string;
  };

  entry: string;
  version: string;
  prefix: string;
  malicious: boolean | null | undefined;
  files: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
  createdAt: string;
}

export interface runJson {
  scripts: {
    [key: string]: string;
  };
}

export interface HelpCommandParams {
  command: {
    alias: string[];
    description: string;
  };
  flags: Array<{
    description: string;
    alias: string[];
  }>;
}

export interface CommandNotFoundParams {
  commands: string[];

  flags: string[];
}
