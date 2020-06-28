import { red, green, yellow } from "https://deno.land/std/fmt/colors.ts";
import { NestResponse } from "../utils/types.ts";
import { offLine } from "../utils/logs.ts";

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
    const logError = `${red("something be wrong\n")}${green(
      "maybe this package not have mod.ts file, use custom install.\n"
    )}${yellow("Trex --custom module=moduleUrl\n")}`;

    throw new Error(logError).message;
  }
}
