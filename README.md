
# Welcome to Trex!

## Trex 🐱‍🐉

![Trex](https://i.ibb.co/fF4BRkZ/trexquad.jpg)

 Package management for deno

### What is Trex?

is a "Package management" for deno to implement an import_map.json for your imports is an easiest way to make imports in deno.

```
// import_map.json

{
	"imports":  {
		"http/":  "https://deno.land/std/http/"
	}
}
```
For more information about the import maps in deno [import maps](https://deno.land/manual/linking_to_external_code/import_maps)

## Guide:

installation:

Download the repository and open the terminal in the folder of the repository and write:

    deno install --allow-read --allow-write --unstable Trex.ts

>__note__:  You should have the last version of deno for no errors.

or in your terminal you can write

```
deno install --allow-read --allow-write --unstable https://raw.githubusercontent.com/Crew-Dev/Trex/master/Trex.ts
```
check for the installation of the Trex tool writing in the terminal:

    Trex --version

and the console should presente the Trex version.

for any help of the commands of Trex write:

    Trex --help

and the console should present:

help:
    * flags
       --map: for install a library
       --version: logs version
       --custom: for install custom package

    * install module using:
       Trex install --map fs http

    * install custom module usig:
       Trex --custom [module_name]=[module_url]

    * uninstall module using:
       Trex delete [module_name]

for a better implementation of this tool you can use the tool Commands of deno [Commands](https://deno.land/x/commands)