interface Paramans {
  config: {
    permissions: string[];
    url: string;
  }
}

function installTools(args: string[]) {
  return Deno.run({ cmd: ["deno", ...args], stdout: "piped" });
}

export default async function exec(param: Paramans): Promise<void> {
  const args: string[] = [
    "install",
    ...param.config.permissions,
    param.config.url,
  ];

  const app: Deno.Process = installTools(args);
  const decoder = new TextDecoder("utf-8");

  const out = await app.output();
  console.log(decoder.decode(out));
}
