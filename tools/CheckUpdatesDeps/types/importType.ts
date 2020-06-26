export type importsType = {
  imports: {};
};

export interface Module {
  type: string;
  owner: string;
  repo: string;
  desc: string;
  default_version: string;
}

export type repo = { [key: string]: Module };
