import { offLine } from "../utils/logs.ts";
import { NestResponse } from "../utils/types.ts";

export async function nestPackageUrl(pkgName: string, version: string): Promise<string> {
  const response = await fetch(
    `https://x.nest.land/api/package/${pkgName}/${version}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    }
  ).catch((_) => offLine()) as Response;

  const data: NestResponse = await response.json();


  return data.prefix + data.entry;
}
