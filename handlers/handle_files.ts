import { writeJson } from "https://deno.land/std/fs/mod.ts";
import { green, cyan } from "https://deno.land/std/fmt/colors.ts";

export function checkPackage() {
  const decoder = new TextDecoder("utf-8");

  // * get data from import_map and return data
  const Package = Deno.readFileSync("./import_map.json");

  return decoder.decode(Package);
}

export async function createPackage(template: Object, log?: Boolean) {
  // * create import_map.json
  await Deno.createSync("./import_map.json");
  // * write import config inside import_map.json
  await writeJson("./import_map.json", { imports: template }, { spaces: 2 });

  if (log) {
    // * log packages list
    console.group("Packages list: ");
    for (const pkg in template) {
      console.log("|- ", cyan(pkg));
    }
    console.groupEnd();
    console.log(green("Happy Coding"));
  }
}
