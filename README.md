# Welcome to Trex!

## Trex 🐱‍🐉

[![GitHub issues](https://img.shields.io/github/issues/crewdevio/Trex)](https://github.com/crewdevio/Trex/issues) [![GitHub forks](https://img.shields.io/github/forks/crewdevio/Trex)](https://github.com/crewdevioTrex/network) [![GitHub stars](https://img.shields.io/github/stars/crewdevio/Trex)](https://github.com/crewdevio/Trex/stargazers) [![GitHub license](https://img.shields.io/github/license/crewdevio/Trex)](https://github.com/crewdevio/Trex/blob/master/LICENSE) ![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/crewdevio/Trex)

![Trex](https://i.ibb.co/fF4BRkZ/trexquad.jpg)

Package management for deno

### What is Trex?

is a "Package management" for deno to implement an import_map.json for your imports is an easiest way to make imports in deno.

```javascript
// import_map.json

{
    "imports":  {
	"http/":  "https://deno.land/std/http/"
    }
}
```

For more information about the import maps in deno [import maps](https://deno.land/manual/linking_to_external_code/import_maps)

## Setup visual studio code

install the [deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) extension first, then add in settings.json the following configuration.

![settings.json](https://i.ibb.co/YyCD6RY/config-Json-Deno.png)

activate the enable option **Deno unstable features** in **settings >> extensions >> Deno**

![unstable](https://i.ibb.co/p4hDp41/enable.jpg)

if you get this error after installing a module.

![error](https://i.ibb.co/RvhKp5s/error.jpg)

run your project to cache all dependencies.

> **note**: We are working so that when a module is installed in import_map.json it will be cached to avoid this error when calling the module. it is currently being tested on windows and linux but it is an instable feature at the moment

## Guide:

### installation:

Download the repository and open the terminal in the folder of the repository and write:

```sh
$  deno install --allow-read --allow-write --allow-net --allow-run --unstable Trex.ts
```

> **note**: You should have the last version 1.0.0 >= of deno for no errors.

or in your terminal you can write

```sh
$  deno install --allow-read --allow-write --allow-net --allow-run --unstable https://deno.land/x/trex/Trex.ts
```

### update Trex using

```sh
$  deno install -f --allow-read --allow-write --allow-net --allow-run --unstable https://deno.land/x/trex/Trex.ts
```

or use:

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

```
Package management for deno to implement an import_map.json for your imports is an easiest way to make imports in deno.

* install module using:
   Trex install --map module_name

* install custom module usig:
   Trex --custom module_name=module_url

* uninstall module using:
   Trex delete module_name

* install Tool using:
   Trex getTool tool_name

* update Trex using:
   Trex update

* check modules version using:
   Trex --deps

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
   [install or i] install some module
   delete     delete a module from import_map.json.

   getTool    install some tool.

   update     update Trex.
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

### install another version of a module

write the name of the module more **@\<Version\>**

example:

```sh
$ Trex install --map fs@0.`5`4.0
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

View version

```sh
$ Trex --version
```

View help

```sh
$ Trex --help
```

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

  - We are working to you can choose the target file

- [x] List all the tools you can install.

- [x] choose the destination file when installing a module.

  - `$ Trex --custom djwt/create.ts=https://deno.land/x/djwt/create.ts`
