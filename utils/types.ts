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
