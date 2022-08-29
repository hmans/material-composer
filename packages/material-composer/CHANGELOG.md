# material-composer

## 0.1.0-next.1

### Patch Changes

- 5008651: `Translate`, `Velocity` and `Acceleration` now have a new `space` prop that allows the user to specify which reference space the given vector or offset exists in. Available options are:

  `world` - The vector or offset is in world space. This is the default.
  `local` - The vector or offset is in local space. (This includes the instance transform when used in an instanced rendering context.)
  `view` - The vector or offset is in view space.

  ```tsx
  <modules.Translate
    offset={Mul(new Vector3(1, 0, 0), Sin(time))}
    space="view"
  />
  ```

## 0.1.0-next.0

### Minor Changes

- 03036bd: **Breaking Change**: `Translate` now no longer performs any space transformations on the given `offset`. The user is expected to perform this themselves. (For example, if you're animating particles, you may want to transform the offset you intend to apply to instance space first.)

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

- 309031a: The `Color` module can now accept a `THREE.ColorRepresentation` as its `color` argument:

  ```js
  Modules.Color({ color: "hotpink" })
  ```

  Or in JSX:

  ```jsx
  <modules.Color color="hotpink">
  ```

- 890f011: Refactored `ComposableMaterial.compileModules()` to take the new modules as an argument, and return early if the object is equal to the last list of modules that were used. This fixes some unwanted recompiles in React scenarios.
- 6ddeae7: Modules can now read from and write into `roughness` and `metalness`.

## 0.0.2

### Patch Changes

- 75af3f0: First release through changesets, woohoo!
