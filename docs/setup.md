## Setup [visual studio code](https://code.visualstudio.com/)

first install [deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) extension.

Trex now can setup your project for work with Deno.

Then you run:

```sh
trex setup --vscode
```

this will create the folder .vscode and the settings.json file (if it doesn't exist, if exist will write the setup with your old settings).
`settings.json`

```json
{
  "deno.enable": true,
  "deno.import_map": "./import_map.json",
  "deno.unstable": true
}
```

if you get this error after installing a module.

![error](https://i.ibb.co/RvhKp5s/error.jpg)

run your `trex install` to cache all dependencies.

> **note**: when installing a module using ( trex install --map someModule )
> or ( trex --custom someModule=someModule.com/someModule.ts ) this is automatically cached

## Setup [Atom](https://atom.io/)

Trex will install some of dependencies to setup Deno in a project:
- [typescript plugin.](https://atom.io/packages/atom-typescript)
- [typescript-deno-plugin](https://github.com/justjavac/typescript-deno-plugin)

run the following command:
```sh
trex setup --atom
```

Choose your package manager:

![atom-setup](https://cdn.discordapp.com/attachments/731031131004076045/763181318686375976/es.png)


Then trex will create the [tsconfig.json.](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-deno-plugin",
        "enable": true,
        "importmap": "./import_map.json"
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
