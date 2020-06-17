import { green, yellow, red } from "https://deno.land/std/fmt/colors.ts";
import { proxyPkg } from "../utils/types.ts";

const modulesProxys: Array<proxyPkg> = [
  {
    module: "_util",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/_util.ts",
  },
  {
    module: "archive",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/archive.ts",
  },
  {
    module: "encoding",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/encoding.ts",
  },
  {
    module: "fmt",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/fmt.ts",
  },
  {
    module: "node",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/node.ts",
  },
  {
    module: "testing",
    url:
      "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/proxy/proxy_files/testing.ts",
  },
];

const modules = ["_util", "archive", "encoding", "fmt", "node", "testing"];

export function needProxy(pkg: string) {
  return modules.includes(pkg);
}

export function Proxy(pkg: string): string {
  console.log(
    yellow("warning: "),
    red(pkg),
    green(" se a proxy to download your data. \n")
  );

  console.log(
    green(
      "For more information on how the proxy works visit https://github.com/crewdevio/Trex\n"
    )
  );
  return modulesProxys.find((pxy) => pxy.module === pkg)?.url as string;
}
