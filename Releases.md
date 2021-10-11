# Releases

### v0.2.4

Changes:

- feature: Integrity checking & lock files using:
  - `$ Trex --lock file.ts`
- feature: show message when offline.

### v0.2.3

Changes:

- feature: installed modules are removed from cache when run `$ Trex delete fs`
  - only with standard modules and those installed from `deno.land/x`
- feature: proxy to download some modules from the standard library that do not
  have the `mod.ts` file

### v0.2.2

Changes:

- feature: cache custom modules.
- feature: new style in help info.
- feature: see module dependency tree.
