### Proxy

Some modules in the standard deno library do not have a `mod.ts` file.

When installing a standard library module, a request is made to `deno.land/std/moduleName/mod.ts`
to be able to cache the module.
the solution we have is to create a bridge between the request to download the module and the files in the library.

![proxy](https://i.ibb.co/f97j2Rm/proxy.png)

in the [proxy folder](https://github.com/crewdevio/Trex/tree/proxy) are the bridges of the modules that do not have the `mod.ts` file.

**these are the modules that use proxy**

- \_util
- archive
- encoding
- fmt
- node
- testing
