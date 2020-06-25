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

### Proxy

Some modules in the standard deno library do not have a `mod.ts` file.

When installing a standard library module, a request is made to `deno.land/std/moduleName/mod.ts`
to be able to cache the module.
the solution we have is to create a bridge between the request to download the module and the files in the library.

![proxy](https://i.ibb.co/f97j2Rm/proxy.png)

in the [proxy folder](https://github.com/crewdevio/Trex/tree/proxy/proxy) are the bridges of the modules that do not have the `mod.ts` file.

**these are the modules that use proxy**

- \_util
- archive
- encoding
- fmt
- node
- testing
