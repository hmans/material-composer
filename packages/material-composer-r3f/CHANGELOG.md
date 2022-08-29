# material-composer-r3f

## 0.1.0-next.1

### Minor Changes

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

- 29228c7: `makeModuleComponent` is now just `moduleComponent`.

### Patch Changes

- 2bef9a4: `<composable.*>` now supports a new `autoShadow` property. When set to true, a custom depth material will be automatically created and assigned to the mesh, inheriting the vertex shader part of the composed material.

  Example:

  ```tsx
  <mesh castShadow>
    <icosahedronGeometry args={[1, 8]} />

    <composable.MeshStandardMaterial autoShadow>
      <modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />

      <Lava
        offset={Mul(vec3(0.1, 0.2, 0.5), time)}
        scale={0.3}
        octaves={5}
        power={1}
      />
    </composable.MeshStandardMaterial>
  </mesh>
  ```

  > **Note** If you want the shadow to behave differently from the mesh, just skip the use of the `autoShadow` property and define your own depth material.

- Updated dependencies [daa12d9]
- Updated dependencies [e5c8e88]
- Updated dependencies [29228c7]
- Updated dependencies [835b5fd]
  - material-composer@0.1.0-next.2
  - @material-composer/patch-material@0.1.1-next.0
  - @material-composer/patched@0.1.1-next.0

## 0.0.3-next.0

### Patch Changes

- 42914fb: **New feature: Layers!** Layers act as groups and, more importantly, allow you to perform blend operations on them. Each layer allows you to specify an `opacity` (the factor at which the layer will be mixed in; defaults to `1`) and optionally a `blend` operation, which can be a function, or a the name of one of the provided blend functions. Some examples (all of these are roughlt equivalent):

  ```tsx
  <Layer blend={Blend.add}>
    <modules.Fresnel />
  </Layer>

  <Layer opacity={Fresnel()} blend="add">
    <modules.Color color="white" />
  </Layer>

  <Layer blend={(a, b) => Add(a, Mul(b, Fresnel()))}>
    <modules.Color color="white" />
  </Layer>
  ```

- 309031a: The React glue was rewritten to provide a much nicer development experience with stable support for Hot Module Reloading. Enjoy, this one was a little tricky!
- 890f011: Refactored `ComposableMaterial.compileModules()` to take the new modules as an argument, and return early if the object is equal to the last list of modules that were used. This fixes some unwanted recompiles in React scenarios.
- Updated dependencies [42914fb]
- Updated dependencies [309031a]
- Updated dependencies [890f011]
- Updated dependencies [03036bd]
- Updated dependencies [6ddeae7]
  - material-composer@0.1.0-next.0

## 0.0.2

### Patch Changes

- 75af3f0: First release through changesets, woohoo!
- Updated dependencies [75af3f0]
  - material-composer@0.0.2
