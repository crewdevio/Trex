/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type objectGen = { [key: string]: string };
export type proxyPkg = { module: string; url: string };

export interface deps {
  meta: {
    [key: string]: {
      url: string;
      hash: string;
    };
  };
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

export type pkgResponse = {
  name: string;
  description: string;
  star_count: number;
};

export const errorsMessage = {
  keyNotFound: "deps.json file does not have meta key",
  lockFile: "Error: creating lock.json file",
  importsFolder :"the imports folder does not exist",
  depsNotFound: "deps.json file not found",
  deleteError: "the package cannot be removed from the imports folder",
  depsFormat: "the deps.json file is not in a valid format",
  noPackage: "The deps.json file has no registered packages",
  installationError: "something went wrong in the installation",
  processError: "a process not completed successfully",
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

export interface runJson {
  scripts: {
    [key: string]: string;
  };
}