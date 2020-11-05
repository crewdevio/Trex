/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IDES, atomInstaller, IDESsettings } from "../utils/info.ts";
import { writeJson } from "../temp_deps/writeJson.ts";
import { prompt } from "../utils/prompt.ts";
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";


const { mkdir, create } = Deno;
const { cyan, green, yellow } = colors;

/**
 * Select the right template for your IDE
 * @param {string}template The choose valid editor from the arrays of IDES (check file "setupIDE")
 * @returns Promise void
 */

async function templateSetup(template: string) {
  if (template === IDES[0]) {
    await mkdir(".vscode", { recursive: true });
    await create("./.vscode/settings.json");
  }

  else if (template === IDES[1]) {
    await create("./tsconfig.json");

  }
}

/**
 * ead the data from a json setting a return it
 * @param editor arg what is pass from de Deno args
 * @returns data from the setting config
 */
async function getSettingsFile(editor: string): Promise<string>{
  let settingPath: any;
  if (editor === IDES[0]){
    settingPath = "./.vscode/settings.json"
  }
  else if (editor === IDES[1]) {
    settingPath = "./tsconfig.json"
  }
  const decoder = new TextDecoder("utf-8");

  // * get data from settings.json and return data
  const Setting = await Deno.readFile(settingPath);

  return decoder.decode(Setting);
}

/**
 * Write the Deno setup in the json
 * @param {Object} map the new json config for the setup
 * @param editor arg what is pass from the Deno args
 */
async function createSetup(map: Object, editor: string) {
  let path: any;

  if (editor === IDES[0]){
    path = "./.vscode/settings.json"
  }
  else if (editor === IDES[1]) {
    path = "./tsconfig.json"
  }

  try {
    await writeJson(
      path,
      { ...map },
      { spaces: 2 }
    );
  }

  catch (_) {
    throw new Error(_).message;
  }
}
/**
 * Prepare your IDE to work with Deno
 * @param {string} editor The Deno argument pass in the console
 * @returns {void} Promise void
 */
export async function setupIDE(editor: string): Promise<void> {
  let denoSetup;
  switch (editor) {
    case IDES[0]:

      if (await exists("./.vscode")) {

        const overWrite = await prompt(
          green("There is already a .vscode folder. Want to add de deno setup?: ")
        );

        if (overWrite === "yes".toLocaleLowerCase() || overWrite === "y".toLocaleLowerCase()){
          let oldData = JSON.parse(await getSettingsFile(editor));
          denoSetup = IDESsettings[0]
          await Deno.remove("./.vscode", { recursive: true });
          await templateSetup(editor);
          createSetup({...oldData, ...denoSetup}, editor)
          console.log(cyan("Done, your project is already setup to use Deno"));

        }

        else {
          console.log(green("You will be using your actual settings."))
        }
      }

      else {
        console.log(green("Setting up the project for work with Deno"));
        denoSetup = IDESsettings[0]
        templateSetup(editor);
        createSetup({...denoSetup}, editor)
        console.log(cyan("Done, your project is already setup to use Deno"));
      }
      break;

    case IDES[1]:
      denoSetup = IDESsettings[1];
      let process: Deno.Process;
      console.log(green("We need to download some dependencies to work with deno."))
      const packageManager = await prompt(
        green("What package manager you use? NPM or Yarn?: ")
        );

      if (packageManager === Object.keys(atomInstaller)[0].toLowerCase()) {
        console.log("Downloading dependencies...")
        process = Deno.run({
          cmd: [...atomInstaller["npm"]],
        });

        if (!(await process.status()).success) {
          process.close();
          throw new Error("error running the installer").message;
        }

        else {
          console.log(cyan("Done, All dependencies were downloaded"));
          process.close();
        }
        if (await exists("./tsconfig.json")){
          let overWrite = await prompt("There's already a tsconfig.json, do you want overwrite with the new setup?");
          const oldData = JSON.parse(await getSettingsFile(editor));
          if (overWrite === "y".toLowerCase() || overWrite === "yes".toLowerCase()){
            Deno.removeSync("./tsconfig.json");
            await templateSetup(editor);
            await createSetup({...oldData, ...denoSetup}, editor);
            console.log(cyan("Your project is already to work with Deno"))
          }
        }
        else {
          await templateSetup(editor);
          createSetup({...denoSetup}, editor);
          console.log(cyan("Your project is ready to work with Deno"))
        }
      }

      else if (
        packageManager === Object.keys(atomInstaller)[1].toLowerCase()
        ) {
          console.log(green("Downloading the dependencies for the setup..."));
          process = Deno.run({
            cmd: [...atomInstaller["yarn"]],
          });

        if (!(await process.status()).success) {
          process.close();
          throw new Error("error running the installer").message;
        }

        else {
          console.log(cyan("Done, your project is already setup to use Deno"));
          process.close();
        }
        if (await exists("./tsconfig.json")){
          let overWrite = await prompt("There's already a tsconfig.json, do you want overwrite with the new setup?");
          const oldData = JSON.parse(await getSettingsFile(editor));
          if (overWrite === "y".toLowerCase() || overWrite === "yes".toLowerCase()){
            Deno.removeSync("./tsconfig.json");
            await templateSetup(editor);
            await createSetup({...oldData, ...denoSetup}, editor);
            console.log(cyan("Your project is already to work with Deno"))
          }
        }
        else {
          await templateSetup(editor);
          createSetup({...denoSetup}, editor);
          console.log(cyan("Your project is ready to work with Deno"))
        }
      }

      else {
        console.log(
          yellow(
            "Warning: You have to pick up a package manager to install the dependencies, try again."
          )
        );
      }

      break;

    default:
      console.log(
        cyan(yellow("Warning: you have to set your IDE, vscode or atom"))
      );
      break;
  }
}
