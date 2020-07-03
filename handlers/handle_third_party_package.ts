import { offLine,  ErrorInstalling } from "../utils/logs.ts";
import { NestResponse } from "../utils/types.ts";

export async function nestPackageUrl(
  pkgName: string,
  version: string
): Promise<string> {
  const response = (await fetch(
    `https://x.nest.land/api/package/${pkgName}/${version}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    }
  ).catch((_) => offLine())) as Response;

  const data: NestResponse = await response.json();

  return data.prefix + data.entry;
}

export async function cacheNestpackage(url: string): Promise<void> {
  const process = Deno.run({
    cmd: ["deno", "install", "-f", "-n", "Trex_Cache_Map", "--unstable", url],
  });

  if (!(await process.status()).success) {
    ErrorInstalling();
  }
}

export function pkgRepo(url: string, pkgName: string | undefined) {
  const [user, repo, ...path] = url.split("/");

  return [
    pkgName ? pkgName : repo,
    `https://denopkg.com/${user}/${repo}/${path.join("/")}${
      path.length ? "" : "mod.ts"
    }`,
  ];
}
