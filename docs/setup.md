## Setup [visual studio code](https://code.visualstudio.com/)

first install [deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) extension, then add a folder .vscode /settings.json the following settings.

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
