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
