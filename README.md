# Material Composer

## Summary

Use Material Composer to assemble GPU-based Three.js materials from a collection of provided modules (or your own, custom-built ones.) Modules are authored using [Shader Composer], which will compile them into one combined shader.

## Ecosystem

### Packages

This project provides multiple packages. Please refer to each individual package for further documentation.

- **[material-composer](https://github.com/hmans/material-composer/tree/main/packages/material-composer)**  
  Core package for use with vanilla Three.js.
- **[material-composer-r3f](https://github.com/hmans/material-composer/tree/main/packages/material-composer-r3f)**  
  Bindings for react-three-fiber.

It also provides a couple of micropackages that are used by the packages listed above, but can also be used independently where needed:

- **[@material-composer/patch-material](https://github.com/hmans/material-composer/tree/main/packages/material-composer-patch-material)**  
  Provides `patchMaterial`, a function that can patch an existing material instance with a user-provided shader, as well as a `PatchedMaterialMaster` for use with [Shader Composer].
- **[@material-composer/patched](https://github.com/hmans/material-composer/tree/main/packages/material-composer-patched)**  
  Provides `patched`, a React component proxy that can be used to wrap any material component with a `patchMaterial` call.

### Projects using Material Composer

- **[VFX Composer](https://github.com/hmans/vfx-composer)**  
  A high-performance GPU particle engine for Three.js.

## License

```
Copyright (c) 2022 Hendrik Mans

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

[shader composer]: https://github.com/hmans/shader-composer
