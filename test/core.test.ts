// import { installPackages, customPackage } from "../handlers/handle_packages.ts";
// import { packageTreeInfo } from "../tools/logs.ts";
// import { setupIDE } from "../tools/setupIDE.ts";
// import { HelpCommand } from "../utils/logs.ts";
// import { Merlin } from "../imports/merlin.ts";

// const merlin = new Merlin();

// merlin.testEqual("install custom package", {
//   async expect() {
//     const data = await customPackage(
//       ...[
//         "--custom",
//         "merlin=https://raw.githubusercontent.com/crewdevio/merlin/master/mod.ts",
//       ]
//     );

//     return data;
//   },
//   toBe() {
//     return true;
//   },
//   Ops: false,
//   Resources: false,
// });

// merlin.testEqual("install package from deno.land", {
//   async expect() {
//     const pkg = await installPackages(["i", "--map", "oak"]);

//     return pkg;
//   },
//   toBe() {
//     return { oak: "https://deno.land/x/oak/mod.ts" };
//   },
//   Ops: false,
//   Resources: false,
// });

// merlin.testEqual("install package from nest.land", {
//   async expect() {
//     const pkg = await installPackages(["i", "--nest", "dinoenv@1.0.0"]);

//     return pkg;
//   },
//   toBe() {
//     return {
//       dinoenv:
//         "https://arweave.net/Rru09TE8WVU_0eMY5lWAM6xsZxbVDScnqkrGvZPjEs4/mod.ts",
//     };
//   },
//   Ops: false,
//   Resources: false,
// });

// merlin.isUndefined("Trex treeDeps test", {
//   async value() {
//     return await packageTreeInfo(...["--unstable", "treeDeps", "react"]);
//   },
//   Ops: false,
//   Resources: false,
// });

// merlin.isUndefined("Setup IDE", {
//   async value(){
//     return await setupIDE("--vscode");
//   },
//   Ops: false,
//   Resources: false
// })

// merlin.isUndefined("Command helper test", {
//   async value() {
//     return HelpCommand({
//       command: {
//         alias: ["install", "i"],
//         description: "install a package",
//       },
//       flags: [
//         { alias: ["--map", "-m"], description: "install package from deno.land" },
//         { alias: ["--nest", "-n"], description: "install package from nest.land" },
//         {
//           alias: ["--pkg", "-p"],
//           description: "install package from some repository",
//         },
//         { alias: ["--help, -h"], description: "show command help" },
//       ],
//     });
//   },
//   Ops: false,
//   Resources: false
// })