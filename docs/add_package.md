# Make your package available for download from Trex

You can make your package available to download from trex by hosting them at:

- [deno.land/x](https://nest.land/)
- [nest.land](https://nest.land/)
- [your own repository](#)

### From `deno.land/std and deno.land/x`:

```sh
$ trex install --map [packageName]
```

```sh
$ trex install --map [packageName]@[version]
```

With this command you can install packages from the standard deno library and those hosted at `deno.land/x`

### From `nest.land`:

```sh
$ trex install --nest [packageName]@[version]
```

this will download package from nest.land

### From your own repository:

```sh
$ trex install --pkg [user]/[repo or repo@tag]/[path/to/file] [packageName]
```

example:

```sh
$ trex install --pkg oakserver/oak/mod.ts oak
```

this downloads oak directly from its repository
