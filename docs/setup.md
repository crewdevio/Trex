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
