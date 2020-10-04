/**
 * Copyright (c) Crew Dev.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { writeJsonSync } from "../temp_deps/writeJson.ts";
import { prompt } from "../utils/prompt.ts"
import { colors } from "../imports/fmt.ts";
import { exists } from "../imports/fs.ts";


const { mkdir, create } = Deno;
const { cyan, green, yellow } = colors;
const IDES = [
    "vscode",
    "atom"
]

const atomInstaller = {
    "npm": ["npm", "install", "--save-dev", "typescript-deno-plugin", "typescript"],
    "yarn": ["yarn", "add", "-D", "typescript-deno-plugin", "typescript"]
}

/**
 * Select the right template for your IDE
 * @param {string}template The choosen valid editor from the arrays of IDES (check file "setupIDE")
 * @returns Promise void
 */
async function templateSetup(template: string) {

    if (template === IDES[0]){

        await mkdir(".vscode");
        await create("./.vscode/settings.json");
        writeJsonSync(
            "./.vscode/settings.json",
            {
                "deno.enable": true,
                "deno.import_map": "./import_map.json",
                "deno.unstable": true
            },
            { spaces: 2 });
    }
    else if (template === IDES[1]){
        await create("./tsconfig.json");
        writeJsonSync(
            "./tsconfig.json",
            {
                "compilerOptions": {
                    "plugins": [
                      {
                        "name": "typescript-deno-plugin",
                        "enable": true,
                        "importmap": "import_map.json"
                      }
                    ]
                  }
            },
            { spaces: 2 });
    }
}

/**
 * Prepare your IDE to work with Deno
 * @param {string} editor The Deno argument pass in the console
 * @returns {void} Promise void
 */
export async function setupIDE(editor: string): Promise<void> {

    switch (editor){

        case IDES[0]:
            if (await exists("./.vscode")) {

                console.log(green("There is already a .vscode folder. \n creating the new setup..."));
                await Deno.remove("./.vscode", {recursive: true });
                await templateSetup(editor);
                console.log(cyan("Done, your project is already setup to use Deno"));
            }
            else {
              console.log(green("Setting up the project for work with Deno"))
              templateSetup(editor)
              console.log(cyan("Done, your project is already setup to use Deno"));
            }
            break;

        case IDES[1]:
            let process: Deno.Process;
            const packageManager = await prompt(green("What package manager you use? NPM or Yarn?: "));

            if (packageManager ===  Object.keys(atomInstaller)[0].toLowerCase()){

                process = Deno.run({
                    cmd: [...atomInstaller["npm"]],
                  });

                  if (!(await process.status()).success) {
                    process.close();
                    throw new Error("error running the installer").message;
                  } else {
                    console.log(cyan("Done, your project is already setup to use Deno"));
                    process.close();
                  }
                await templateSetup(editor)
            }
            else if (packageManager === Object.keys(atomInstaller)[1].toLowerCase()) {

                console.log(green("Downloading the dependencies for the setup..."));
                process = Deno.run({
                    cmd: [...atomInstaller["yarn"]],
                  });

                  if (!(await process.status()).success) {
                    console.log(cyan("Done, your project is already setup to use Deno"));
                    process.close();
                    throw new Error("error running the installer").message;
                  } else {
                    console.log(cyan("Done, your project is already setup to use Deno"));
                    process.close();
                  }
                await templateSetup(editor);

            }
            else {
                console.log(yellow("Warning: You have to pick up a package manager to install the dependecies, try again."));
            }

            break;

        default:
            console.log(cyan(yellow("Warning: you have to set your IDE, vscode or atom")));
            break;
    }
  }
