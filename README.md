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

![Use Trex](https://cdn.discordapp.com/attachments/727169454667989016/728363543614980116/ajio.gif)

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

# Content

- [Proxy](docs/proxy.md)

- [Setup your IDE](docs/setup.md)

- [Integration with nest.land](docs/nest_land_setup.md)

- [How can I have my package available to download with Trex?](docs/add_package.md)

- [How can I add my tool to make it available on Trex?](docs/add_tool.md)

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

for a better implementation of this tool you can use the tool Commands of deno [Commands](https://deno.land/x/commands)

# How to use

in your command line write:

```sh
$ Trex install --map fs http fmt
```

> **note**: you can use **Trex i --map fs http fmt**

`--map` installs packages from the standard library and those hosted at `deno.land/x`

<details><summary>install package from nest.land or a repository (click me)</summary>
<p>

Install a package hosted on [nest.land](https://nest.land/gallery)

```sh
$ Trex install --nest opine@0.13.0
```

> **note**: if you install a package using nest.land you must specify the version, example: `$ Trex i --nest opine@0.13.0`

Install a package from some repository

```sh
$ Trex install --pkg [user]/[repo or repo@tag]/[path/to/file] [packageName]
```
example:

```sh
$ Trex install --pkg oakserver/oak/mod.ts oak
```

this downloads oak directly from its repository

</p>
</details>

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

# example.

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

### using third party packages

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

> **note**: third party packages are added using **mod.ts**

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

### download packages from an `import_map.json` file.

```sh
$ Trex install
```

this downloads all the packages listed in the `import_map.json` similar to `npm install`

### add custom package

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

### delete a package

in your command line write:

```sh
$ Trex delete React
```

to remove a specific version from the cache and import_map.json, it only works with standard packages and those installed from `deno.land/x`

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

The packages in the standard library or those installed from `deno.land/x` will be removed from the cache.

### install another version of a package

write the name of the package more **@\<Version\>**

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

> **note**: can be used with third party packages.

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

### see pacakge dependency tree.

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

### Integrity checking & lock files

Let's say your module depends on remote module . When you compile your module for the first time is retrieved, compiled and cached. It will remain this way until you run your module on a new machine (say in production) or reload the cache (through for example). But what happens if the content in the remote url is changed? This could lead to your production module running with different dependency code than your local module. Deno's solution to avoid this is to use integrity checking and lock files.

info from [deno page](https://deno.land/manual/linking_to_external_code/integrity_checking)

**use:**

```sh
$ Trex --lock file.ts
```

this generates a `lock.json` file.

if in input file you use `import_map.json` you can specify it.

```sh
$ Trex --lock --importmap file.ts
```

for more information this is the [deno document](https://deno.land/manual/linking_to_external_code/integrity_checking)

### Contributing
contributions welcome, create a pull request and send us your feature.

### [LICENSE MIT](https://opensource.org/licenses/MIT)

</br>
 <p align="center">
    <img src="http://clipart-library.com/image_gallery/3119.png" width="150">
    <h3 align="center">Trex is powered by</h3>
    <p align="center">
       <a href="https://nest.land/">
	  <img src="https://raw.githubusercontent.com/nestlandofficial/nest.land/master/web/public/favicon.png" width="85" height="85">
       </a>
       <a href="https://deno.land/">
	  <img src="https://raw.githubusercontent.com/denoland/deno_website2/master/public/logo.svg" width="85" height="85">
       </a>
       <a href="https://denopkg.com/">
	  <img src="https://raw.githubusercontent.com/denopkg/denopkg.com/master/public/denopkg.png" width="90" height="90">
       </a>
    </p>
  </p>
