# @material-composer/patch-material

## 0.1.1-next.0

### Patch Changes

- e5c8e88: **Breaking Change:** Refactored the way Material Composer hooks into Three.js materials. This library now no longer uses three-custom-shader-material, but its own implementation of a similar concept. This gives allows the library to live a little closer to the metal, providing added flexibility, and to provide a neat new API for composable materials. In JSX, you can now do the following:

  ```jsx
  <composable.MeshStandardMaterial>
    {/* Modules */}
  </composable.MeshStandardMaterial>
  ```

  This proxies all available Three.js material types. Here's an example using `THREE.MeshPhysicalMaterial`:

  ```jsx
  <composable.MeshPhysicalMaterial>
    {/* Modules */}
  </composable.MeshPhysicalMaterial>
  ```

  If you already have a material instance, you can use `composable.Material`:

  ```jsx
  <composable.Material instance={myMaterial}>
    {/* Modules */}
  </composable.Material>
  ```

  For the imperative world, the library provides `compileModules` and `patchMaterial` functions that can be used like this:

  ```js
  const material = new MeshStandardMaterial({})
  const root = compileModules(modules)
  const [shader, shaderMeta] = compileShader(root)
  patchMaterial(material, shader)
  ```

  These APIs should be considered work-in-progress; future changes are likely.
