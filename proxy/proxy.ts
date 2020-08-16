/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { green, yellow, red } from "https://deno.land/std/fmt/colors.ts";
import { proxyPkg } from "https://deno.land/x/trex/utils/types.ts";

const modulesProxys: Array<proxyPkg> = [
  {
    module: "_util",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/_util.ts",
  },
  {
    module: "archive",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/archive.ts",
  },
  {
    module: "encoding",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/encoding.ts",
  },
  {
    module: "fmt",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/fmt.ts",
  },
  {
    module: "node",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/node.ts",
  },
  {
    module: "testing",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/testing.ts",
  },
  {
    module: "wasi",
    url: "http://denopkg.com/crewdevio/Trex@proxy/proxy/files/wasi.ts",
  },
];

const modules = [
  "_util",
  "archive",
  "encoding",
  "fmt",
  "node",
  "testing",
  "wasi",
];

/**
 * verify if a any module need a proxy url
 */

export function needProxy(pkg: string) {
  return modules.includes(pkg);
}

/**
 * return package proxy url.
 */
export function Proxy(pkg: string): string {
  console.log(yellow("warning: "), red(pkg), green(" is using a proxy. \n"));

  console.log(
    green(
      "For more information on how the proxy works visit https://github.com/crewdevio/Trex\n"
    )
  );
  return modulesProxys.find((pxy) => pxy.module === pkg)?.url as string;
}
