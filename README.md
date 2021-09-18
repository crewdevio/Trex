<h1 align="center">Trex 🦕</h1>

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/772853383803437058/828483429787500564/687474703a2f2f636c69706172742d6c6962726172792e636f6d2f696d6167655f67616c6c6572792f333131392e706e67.png" width="350">
  <p align="center">Package management for deno (pronounced "tee rex") </p>
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
     <img src="https://img.shields.io/badge/deno-%5E1.10.2-green?logo=deno"/>
   </a>
   <a href="https://nest.land/package/Trex">
     <img src="https://nest.land/badge.svg" />
   </a>
</p>

![Use Trex](https://cdn.discordapp.com/attachments/727169454667989016/728363543614980116/ajio.gif)

## About

Trex is a package management tool for deno similar to npm but keeping close to the deno philosophy. Packages are cached and only one `import_map.json` file is generated.

```javascript
// import_map.json

{
  "imports":  {
    "http/":  "https://deno.land/std/http/"
  }
}
```

For more information about the import maps in deno see [import maps](https://deno.land/manual/linking_to_external_code/import_maps).

## Additional topics

- [Proxy](docs/proxy.md)

- [Integration with nest.land](docs/nest_land_setup.md)

- [How can I have my package available to download with Trex?](docs/add_package.md)

## Installation

```console
deno install -A --unstable --import-map=https://deno.land/x/trex/import_map.json -n trex --no-check https://deno.land/x/trex/cli.ts
```

> **note**: Works with deno >= 1.10.2

**we shorten the install command so it's not that long**

The permissions that Trex uses are:

- --allow-net
- --allow-read
- --allow-write
- --allow-run
- --allow-env

You can give those permissions explicitly.

## Updating Trex

Install new version with the `-f` flag:

```console
deno install -f -A --unstable --import-map=https://deno.land/x/trex/import_map.json -n trex --no-check https://deno.land/x/trex/cli.ts
```

Or use the `upgrade` command:

```console
trex upgrade
```

> **note**: available for versions 0.2.0 or higher.
> **note**: if you want to try the latest features before release you can use -the `--canary` flag.

Verify the installation of Trex:

```console
trex --version
```

and the console should print the Trex version.

For help on the commands that Trex provides, use:

```console
trex --help
```

## Usage

### Installing from deno.land

Install the `fs`, `http` and `fmt` modules from std:

```console
trex install --map fs http fmt
```

> **note**: you can use `trex i --map fs http fmt`

`--map` installs packages from the standard library and those hosted at `deno.land/x`

### Installing from nest.land

Install a package hosted on [nest.land](https://nest.land/gallery):

```console
trex install --nest opine@0.13.0
```

> **note**: if you want to install a package using nest.land you must specify a version explicitly as above

You can install packages from std hosted in nest.land by specifying the package and the version:

```console
trex install --nest fs@0.61.0
```

### Installing from a repository

```console
trex install --pkg [user]/[repo or repo@tag/branch]/[path/to/file] [packageName]
```

Example:

```console
trex install --pkg oakserver/oak@main/mod.ts oak
```

> **note**: In the event that the repository uses a branch other than master as the main branch, this must be specified

The above downloads oak directly from its repository.

### Example import map

All installation methods produce an import_map.json file:

```json
{
  "imports": {
    "fs/": "https://deno.land/std/fs/",
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/"
  }
}
```

### Downloading packages

Download all the packages listed in the `import_map.json` similar to `npm install`:

```console
trex install
```

### Adding custom packages

Install a package from a custom URL source:

```console
trex --custom React=https://dev.jspm.io/react/index.js
```

`import_map.json`:

```json
{
  "imports": {
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/",
    "oak": "https://deno.land/x/oak/mod.ts",
    "React": "https://dev.jspm.io/react/index.js"
  }
}
```

### Deleting packages

```console
trex delete React
```

Remove a specific version from the cache and the `import_map.json` file:

```console
trex delete fs@0.52.0
```

`import_map.json`:

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

Removing from cache only works with standard packages and those installed from `deno.land/x`

### Selecting a specific version of a package

Specify a package's version:

```console
trex install --map fs@0.54.0
```

`import_map.json`

```json
{
  "imports": {
    "fs/": "https://deno.land/std@0.54.0/fs/"
  }
}
```

> **note**: can be used with third party packages.

### Check if a dependencie is outdate

if you want to check if one or more dependencies are out of date, only run trex check command.

```console
trex check
```

this checks the dependencies and if there are updates for that dependency.

for now only works for [`deno.land/std`](https://deno.land/std) and [`deno.land/x`](https://deno.land/x) but eventually should work with many registers an cdn

### Run Scripts

now you can create command aliases similar to [npm run](https://docs.npmjs.com/cli-commands/run-script.html), you just have to create a run.json file with the following structure:

```json
{
  "scripts": {
    "welcome": "deno run https://deno.land/std@0.71.0/examples/welcome.ts"
  }
}
```

> **note**: to run command aliases you must use the command `trex run <aliases>`

now you can call a command within another or call a deno script like `denopack` or `eggs` within a command alias

```json
{
  "scripts": {
    "start": "trex run welcome",
    "welcome": "deno run https://deno.land/std@0.71.0/examples/welcome.ts",
    "dev": "denon run ./app.ts",
    "build": "aleph build"
  }
}
```

#### Installation life cycle

when the command `trex install` or `trex i` executed, you can perform actions before and after the execution of `trex install`.

**execution order**:

- preinstall
- install
- postinstall

```json
{
  "scripts": {
    "start": "trex run welcome",
    "welcome": "deno run https://deno.land/std@0.71.0/examples/welcome.ts",
    "dev": "denon run ./app.ts",
    "build": "aleph build",
    "preinstall": "deno --version",
    "postinstall": "deno test --unstable"
  }
}
```

> **note**: you can use the --watch flag to monitor the changes and rerun the script, example: `deno run --watch --unstable https://deno.land/std@0.71.0/examples/welcome.ts`

you can pass arguments in the command alias and these will be resisted by the file to execute

```console
trex run start --port=3000 --env
```

```typescript
console.log(Deno.args); // ["--port=3000", "--env"]
```

#### **Reboot script alias protocol (rsap)**

with trex you can create script aliases that are reloaded every time a file is changed, this can be done using deno's `--watch` flag. If you would like to have this same functionality but with any command alias you want, you can use trex reboot script protocol which reruns the command alias every time changes are detected in the files and folders you specify

`example:`

```json
{
  "scripts": {
    "start": "trex run welcome",
    "welcome": "deno run https://deno.land/std@0.71.0/examples/welcome.ts",
    "dev": "denon run ./app.ts",
    "build": "aleph build"
  },
  "files": ["./app.ts"]
}
```

You only have to add the `files` option in the `run.json` file and it will only observe the files and folders that you specify, if you leave the array empty it will observe all the files.

for the script alias to use `rsap` you just need to add the `--watch` or `-w` flag to the end of the command alias.

`example:`

```json
{
  "scripts": {
    "dev": "go build"
  },
  "files": ["./main.go"]
}
```

```console
trex run dev --watch ...args
```

and of course it can be used with any cli tool, compiler or interpreter.

> **note**: you can create the run file in yaml format

```yaml
- scripts:
    dev: go build

- files:
    - ./main.go
```

a limitation of watch mode is that they do not restart the processes that never end as http servers, in those cases we recommend other alternatives such as [denon](https://deno.land/x/denon)

### Virtual cli tool execution (experimental)

trex exec allows you to run many cli tools hosted at `deno.land/x`

```console
trex exec aleph init hello_world
```

trex will fetch aleph's cli and run without installing it locally using `deno install`, you can also specify the version you want to use.

```console
trex exec aleph@v0.2.28 init hello_world
```

You can also specify the permissions that the cli will use

```console
trex exec --perms env,read,write,net denon run ./app.ts
```

you just have to pass the `--perms` flag followed by the permissions separated by commas

**perms**

- `env`: --allow-env
- `write`: --allow-write
- `read`: --allow-read
- `net`: --allow-net
- `run`: --allow-run
- `reload`: --reload
- `plugin`: --allow-plugin
- `hrtime`: --allow-hrtime
- `A`: --allow-all

> **note**: if you don't specify the permissions, they are all automatically granted to you

you can also use this combined with the command alias

`example`

```javascript
// run.json
{
  "scripts": {
    "denon": "trex exec denon run"
  },
  "files": ["./app.ts"]
}
```

```console
trex run denon ./app.ts
```

and yes you can do this:

```console
trex exec trex exec trex exec ....
```

even this:

```console
trex exec land trex exec land trex exec ....
```

this functionality is heavily inspired by [npx](https://docs.npmjs.com/cli/v7/commands/npx) and [land](https://deno.land/x/land). if you need another alternative to `trex exec` to use in `deno`, [land](https://deno.land/x/land) this is a great option.

### Purge a package or URL

if you want delete a package or url package from cache memory in deno, you can use the purge command to remove from cache memory.

example:

```console
trex purge oak
```

this finds the oak package in the `import_map.json` file and removes it from the cache.

```console
trex purge https://deno.land/x/oak@v6.3.1/mod.ts
```

also can be used with urls

### Checking a package's dependency tree

```console
trex tree fs
```

This prints out something like:

```console
local: C:\Users\trex\AppData\Local\deno\deps\https\deno.land\434fe4a7be02d1875....
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

Let's say your module depends on a remote module.
When you compile your module for the first time, it is retrieved, compiled and cached.
It will remain this way until you run your module on a new machine (e.g. in production) or reload the cache.

But what happens if the content in the remote url is changed?
This could lead to your production module running with different dependency code than your local module.
Deno's solution to avoid this is to use integrity checking and lock files.

Create a lockfile:

```console
deno cache --lock=lock.json --lock-write file.ts
```

The above generates a `lock.json` file.

If you use `import_map.json` in input file, you can specify it:

```console
deno cache --lock=lock.json --lock-write --import-map=import_map.json --unstable file.ts
```

See [deno document](https://deno.land/manual/linking_to_external_code/integrity_checking) for more info.

## Complete example

### A simple std server

Install `http` and `fmt`:

```console
trex install --map http fmt
```

Create a simple server:

```typescript
// server.ts
import { serve } from "http/server.ts";
import { green } from "fmt/colors.ts";

const server = serve({ port: 8000 });
console.log(green("http://localhost:8000/"));

for await (const req of server) {
  req.respond({ body: "Hello World\n" });
}
```

Run the server:

```console
deno run --allow-net --import-map=import_map.json --unstable server.ts
```

> **note**: it is important to use **--import-map=import_map.json --unstable**

### Adding third party packages

Example using [oak](https://deno.land/x/oak)

Add the master version of oak:

```console
trex i --map oak
```

This adds `oak` to the `import_map.json` file:

```json
{
  "imports": {
    "http/": "https://deno.land/std/http/",
    "fmt/": "https://deno.land/std/fmt/",
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

Then create an oak application. Note the `import` statement.

```typescript
// app.ts
import { Application } from "oak";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
```

Run the server:

```console
deno run --allow-net --import-map=import_map.json --unstable app.ts
```

## Contributing

Contributions are welcome, see [CONTRIBUTING GUIDELINES](CONTRIBUTING.md).

## Licensing

Trex is licensed under the [MIT](https://opensource.org/licenses/MIT) license.

</br>
 <p align="center">
    <img src="https://cdn.discordapp.com/attachments/772853383803437058/828483429787500564/687474703a2f2f636c69706172742d6c6962726172792e636f6d2f696d6167655f67616c6c6572792f333131392e706e67.png" width="150">
    <h3 align="center">Trex is powered by</h3>
    <p align="center">
       <a href="https://nest.land/">
	  <img src="https://cdn.discordapp.com/attachments/656976424778989602/735587312448176132/favicon_light.svg" width="85" height="85">
       </a>
       <a href="https://deno.land/">
	  <img src="https://raw.githubusercontent.com/denoland/deno_website2/master/public/logo.svg" width="85" height="85">
       </a>
       <a href="https://denopkg.com/">
	  <img src="https://raw.githubusercontent.com/denopkg/denopkg.com/master/public/denopkg.png" width="90" height="90">
       </a>
    </p>
  </p>
