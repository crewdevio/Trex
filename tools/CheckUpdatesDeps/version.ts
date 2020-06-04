// We handle the methods to look for the latest versions
import { dependencyType } from "./types/dependencyType.ts";
import { soxa } from "https://deno.land/x/soxa/mod.ts";
import { VERSION } from "https://raw.githubusercontent.com/denoland/deno/master/std/version.ts";

export async function addLatestVersions(
  dependencies: dependencyType[]
): Promise<dependencyType[]> {
  let result;
  const databaseResult = await soxa
    .get(
      "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json"
    )
    .catch((error) => {
      console.error("Error getting the database.json file ", error);
    });
  const database = databaseResult.data;
  result = await Promise.all(
    dependencies.map(async (dependency) => {
      if (database[dependency.module]?.type === "github") {
        const url = `https://api.github.com/repos/${
          database[dependency.module].owner
        }/${database[dependency.module].repo}/releases/latest`;
        return await getVersionFromUrl(dependency, url);
      } else if (database[dependency.module]?.type === "deno_std") {
        dependency.latest = VERSION;
        dependency.upToDate = VERSION === dependency.version;
        return dependency;
      } else {
        console.error(
          "This module is not supported yet, please report this with dependency name = ",
          database[dependency.module]
        );
        console.error(
          "This module is not supported yet, please report this with dependency name = ",
          dependency.name
        );
        return dependency;
      }
    })
  );
  return result;
}

async function getVersionFromUrl(
  dependency: dependencyType,
  url: string
): Promise<dependencyType> {
  const versionResult = await soxa.get(url).catch((error) => {
    console.error("Error getting the latest dependency ", error);
  });
  if (versionResult) {
    dependency.latest = versionResult.data.tag_name;
    dependency.upToDate = versionResult.data.tag_name === dependency.version;
  } else {
    dependency.latest = "not found";
  }
  return dependency;
}
