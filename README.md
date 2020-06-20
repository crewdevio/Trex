<h1 align="center">Welcome to Trex 🐱‍🐉</h1>

<p align="center">
  <img src="http://clipart-library.com/image_gallery/3119.png" width="350">
  <p align="center">Package management for deno</p>
</p>

<p align="center">
   <a href="https://github.com/crewdevio/Trex/issues">
     <img alt="GitHub issues" src="https://img.shields.io/github/issues/crewdevio/Trex">
   </a>
   <a href="https://github.com/crewdevio/Trex/network">
     <img alt="GitHub forks" src="https://img.shields.io/github/forks/crewdevio/Trex">
   </a>
   <a href="https://github.com/crewdevio/Trex/stargazers">
     <img alt="GitHub stars" src="https://img.shields.io/github/stars/crewdevio/Trex">
   </a>
   <a href="https://github.com/crewdevio/Trex/blob/master/LICENSE">
     <img alt="GitHub license" src="https://img.shields.io/github/license/crewdevio/Trex">
   </a>
   <a href="https://deno.land">
     <img src="https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno"/>
   </a>
</p>

### What is Trex?

is a Package management for deno similar to npm but maintaining the deno philosophy. packages are cached and only one `import_map.json` file is generated.

```javascript
// import_map.json

{
    "imports":  {
	"http/":  "https://deno.land/std/http/"
    }
}
```

For more information about the import maps in deno [import maps](https://deno.land/manual/linking_to_external_code/import_maps)

## Setup [visual studio code](https://code.visualstudio.com/)

install the [deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) extension first, then add in settings.json the following configuration.

![settings.json](https://i.ibb.co/YyCD6RY/config-Json-Deno.png)

activate the enable option **Deno unstable features** in **settings >> extensions >> Deno**

![unstable](https://i.ibb.co/p4hDp41/enable.jpg)

if you get this error after installing a module.

![error](https://i.ibb.co/RvhKp5s/error.jpg)

run your project to cache all dependencies.

> **note**: when installing a module using ( Trex install --map someModule )
> or ( Trex --custom someModule=someModule.com/someModule.ts ) this is automatically cached

## Setup [Atom](https://atom.io/)

first install [typescript plugin.](https://atom.io/packages/atom-typescript) then install the [typescript-deno-plugin](https://github.com/justjavac/typescript-deno-plugin)

**using npm**

```sh
$ npm install --save-dev typescript-deno-plugin typescript
```

**using yarn**

```sh
$ yarn add -D typescript-deno-plugin typescript
```

Then add a plugins section to your [tsconfig.json.](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```json
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
}
```

> **note**: `enable` by default is `true`

Then restart Atom. after restart you should have no problems.

**before installing**

![atom-setup](https://i.ibb.co/bbHhBkG/after.jpg)

**after installing**

![atom-setup](https://i.ibb.co/z8W4Zt9/before.jpg)

## Guide:

### installation:

Download the repository and open the terminal in the folder of the repository and write:

```sh
$  deno install -A --unstable Trex.ts
```

> **note**: You should have the last version 1.0.0 >= of deno for no errors.

or in your terminal you can write

```sh
$  deno install -A --unstable https://deno.land/x/trex/Trex.ts
```

**we shorten the install command so it's not that long**

The resources that Trex uses are:

- --allow-net
- --allow-read
- --allow-write
- --allow-run
- --allow-env

you can give those permissions explicitly

### update Trex using

```sh
$  deno install -f -A --unstable https://deno.land/x/trex/Trex.ts
```

**or use:**

```sh
$ Trex update
```

for versions 0.2.0 or higher.

check for the installation of the Trex tool writing in the terminal:

```sh
$  Trex --version
```

and the console should presente the Trex version.

for any help of the commands of Trex write:

```sh
$  Trex --help
```

and the console should present:

```sh
advance package management for deno to implement an import_map.

USAGE:
   Trex [OPTIONS] [SUBCOMMAND]

OPTIONS:
   --help
           Prints help information.
   --custom
           install custom module.
   --version
           Prints version information.
   --deps
           show dependencies versions.
   --map
           add module to import_mao.json.

SUBCOMMANDS:
   [install or i]  install some module.

   delete<@version>  delete a module from import_map.json and cache.

   getTool  install some tool.

   update  update Trex.

   treeDeps  view dependencie tree.
```

for a better implementation of this tool you can use the tool Commands of deno [Commands](https://deno.land/x/commands)

# How to use

in your command line write:

```sh
$ Trex install --map fs http fmt
```

> **note**: you can use **Trex i --map fs http fmt**

an import_map.json file will be created with the following.

```json
{
  "imports": {
    "fs/": "https://deno.land/std/fs/",
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/"
  }
}
```

## Usage example.

create a test file

```javascript
// server.ts
import { serve } from "http/server.ts";
import { green } from "fmt/colors.ts";

const server = serve({ port: 8000 });
console.log(green("http://localhost:8000/"));

for await (const req of server) {
  req.respond({ body: "Hello World\n" });
}
```

run in terminal

```sh
$ deno run --allow-net --importmap=import_map.json --unstable server.ts
```

> **note**: it is important to use **--importmap=import_map.json --unstable**

### using third party modules

example using [oak](https://deno.land/x/oak)

```sh
$ Trex i --map oak
```

in import_map.json

```json
{
  "imports": {
    "fs/": "https://deno.land/std/fs/",
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/",
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

> **note**: third party modules are added using **mod.ts**

in server.ts

```javascript
// server.ts
import { Application } from "oak";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
```

run in terminal

```sh
$ deno run --allow-net --importmap=import_map.json --unstable server.ts
```

### add custom module

in your command line write:

```sh
$ Trex --custom React=https://dev.jspm.io/react/index.js
```

in import_map.json

```json
{
  "imports": {
    "fs/": "https://deno.land/std/fs/",
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/",
    "oak": "https://deno.land/x/oak/mod.ts",
    "React": "https://dev.jspm.io/react/index.js"
  }
}
```

### install tools like [velociraptor](https://github.com/umbopepato/velociraptor) or [Commands](https://deno.land/x/commands)

[list of tools you can install](https://crewdevio.github.io/Trex-tools/)

in your command line write:

```sh
$ Trex getTool Commands
```

this will install the tool

> **note**: If you are a linux/MacOs user you'll have to specificate the PATH manually when the tool gets installed the will appear in your terminal **export PATH="/home/username/.deno/bin:\$PATH"**

### delete module

in your command line write:

```sh
$ Trex delete React
```

to remove a specific version from the cache and import_map.json, it only works with standard modules and those installed from `deno.land/x`

```sh
$ Trex delete fs@0.52.0
```

in import_map.json

```json
{
  "imports": {
    "fs/": "https://deno.land/std/fs/",
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/",
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

The modules in the standard library or those installed from `deno.land/x` will be removed from the cache.

### install another version of a module

write the name of the module more **@\<Version\>**

example:

```sh
$ Trex install --map fs@0.54.0
```

in import_map.json

```json
{
  "imports": {
    "fs/": "https://deno.land/std@0.54.0/fs/"
  }
}
```

> **note**: can be used with third party modules.

### check the versions of dependencies using

```sh
$ Trex --deps
```

you should see something like that on the console.

```json
// in import_map.json
{
  "imports": {
    "oak": "https://deno.land/x/oak@v4.0.0/mod.ts",
    "http/": "https://deno.land/std@0.51.0/http/"
  }
}
```

| name  | module |                   url                   | version  |  latest  | upToDate |
| :---: | :----: | :-------------------------------------: | :------: | :------: | :------: |
|  oak  |  oak   | "https://deno.land/x/oak@v4.0.0/mod.ts" | "v4.0.0" | "v5.0.0" |  false   |
| http/ |  std   |  "https://deno.land/std@0.54.0/http/"   | "0.54.0" | "0.54.0" |   true   |

thanks to [Fzwael](https://github.com/Fzwael) this functionality is based on your tool [deno-check-updates](https://github.com/Fzwael/deno-check-updates)

### see module dependency tree.

```sh
$ Trex treeDeps fs
```

you should see this in the terminal

```sh
local: C:\Users\trex\AppData\Local\deno\deps\https\deno.land\434fe4a7be02d187573484b382f4c1fec5b023d27d1dcf4f768f300799a073e0
type: TypeScript
compiled: C:\Users\trex\AppData\Local\deno\gen\https\deno.land\std\fs\mod.ts.js
map: C:\Users\trex\AppData\Local\deno\gen\https\deno.land\std\fs\mod.ts.js.map
deps:
https://deno.land/std/fs/mod.ts
  ├─┬ https://deno.land/std/fs/empty_dir.ts
  │ └─┬ https://deno.land/std/path/mod.ts
  │   ├── https://deno.land/std/path/_constants.ts
  │   ├─┬ https://deno.land/std/path/win32.ts
  │   │ ├── https://deno.land/std/path/_constants.ts
  │   │ ├─┬ https://deno.land/std/path/_util.ts
  │   │ │ └── https://deno.land/std/path/_constants.ts
  │   │ └── https://deno.land/std/_util/assert.ts
  │   ├─┬ https://deno.land/std/path/posix.ts
  │   │ ├── https://deno.land/std/path/_constants.ts
  │   │ └── https://deno.land/std/path/_util.ts
  │   ├─┬ https://deno.land/std/path/common.ts
  │   │ └─┬ https://deno.land/std/path/separator.ts
  │   │   └── https://deno.land/std/path/_constants.ts
  │   ├── https://deno.land/std/path/separator.ts
  │   ├── https://deno.land/std/path/_interface.ts
  │   └─┬ https://deno.land/std/path/glob.ts
  │     ├── https://deno.land/std/path/separator.ts
  │     ├─┬ https://deno.land/std/path/_globrex.ts
  │     │ └── https://deno.land/std/path/_constants.ts
  │     ├── https://deno.land/std/path/mod.ts
  │     └── https://deno.land/std/_util/assert.ts
  ├─┬ https://deno.land/std/fs/ensure_dir.ts
  │ └─┬ https://deno.land/std/fs/_util.ts
  │   └── https://deno.land/std/path/mod.ts
  ├─┬ https://deno.land/std/fs/ensure_file.ts
  │ ├── https://deno.land/std/path/mod.ts
  │ ├── https://deno.land/std/fs/ensure_dir.ts
  │ └── https://deno.land/std/fs/_util.ts
  ├─┬ https://deno.land/std/fs/ensure_link.ts
  │ ├── https://deno.land/std/path/mod.ts
  │ ├── https://deno.land/std/fs/ensure_dir.ts
  │ ├── https://deno.land/std/fs/exists.ts
  │ └── https://deno.land/std/fs/_util.ts
  ├─┬ https://deno.land/std/fs/ensure_symlink.ts
  │ ├── https://deno.land/std/path/mod.ts
  │ ├── https://deno.land/std/fs/ensure_dir.ts
  │ ├── https://deno.land/std/fs/exists.ts
  │ └── https://deno.land/std/fs/_util.ts
  ├── https://deno.land/std/fs/exists.ts
  ├─┬ https://deno.land/std/fs/expand_glob.ts
  │ ├── https://deno.land/std/path/mod.ts
  │ ├─┬ https://deno.land/std/fs/walk.ts
  │ │ ├── https://deno.land/std/_util/assert.ts
  │ │ └── https://deno.land/std/path/mod.ts
  │ └── https://deno.land/std/_util/assert.ts
  ├─┬ https://deno.land/std/fs/move.ts
  │ ├── https://deno.land/std/fs/exists.ts
  │ └── https://deno.land/std/fs/_util.ts
  ├─┬ https://deno.land/std/fs/copy.ts
  │ ├── https://deno.land/std/path/mod.ts
  │ ├── https://deno.land/std/fs/ensure_dir.ts
  │ ├── https://deno.land/std/fs/_util.ts
  │ └── https://deno.land/std/_util/assert.ts
  ├── https://deno.land/std/fs/read_file_str.ts
  ├── https://deno.land/std/fs/write_file_str.ts
  ├── https://deno.land/std/fs/read_json.ts
  ├── https://deno.land/std/fs/write_json.ts
  ├── https://deno.land/std/fs/walk.ts
  └── https://deno.land/std/fs/eol.ts
```

### Proxy

Some modules in the standard deno library do not have a `mod.ts` file.

When installing a standard library module, a request is made to `deno.land/std/moduleName/mod.ts`
to be able to cache the module.
the solution we have is to create a bridge between the request to download the module and the files in the library.

![proxy](https://i.ibb.co/f97j2Rm/proxy.png)

in the [proxy folder](https://github.com/crewdevio/Trex/tree/beta-test/proxy) are the bridges of the modules that do not have the `mod.ts` file.

**these are the modules that use proxy**

- \_util
- archive
- encoding
- fmt
- node
- testing

## To Do

- [x] install std modules and third party modules in deno.land/x.

- [x] delete modules from import_map.json.

- [x] support for custom module outside of deno third party modules.

- [x] sort modules names in import_map.json.

- [x] support to install tools like [Commands.](https://deno.land/x/commands)

  - if you want add your tool in database edit this file [database.json](database.json)

- [x] update using:

  - `$ Trex update`

- [x] support to choose install other versions of modules:

  - `$ Trex install --map fs@0.50.0`

- [x] safe installation for tools like [Commands](https://deno.land/x/commands), [velociraptor](https://deno.land/x/velociraptor) or [dpx.](https://deno.land/x/dpx)

  - display a warning message with the permissions of the tool

- [x] check the versions of the libraries.

  - `$ Trex --deps`

- [x] System to cache package when install it. (!unstable):

  - it is currently being tested on windows and linux but it is an instable feature at the moment.

    > **note**: by default it caches the modules using the mod.ts file, if it cannot find it, it does not add it to the cache but add to the import_map.json.

- [x] List all the tools you can install.

- [x] choose the destination file when installing a module.

  - `$ Trex --custom djwt/create.ts=https://deno.land/x/djwt/create.ts`
