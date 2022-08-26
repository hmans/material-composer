# material-composer-r3f

## 0.0.3-next.0

### Patch Changes

- 42914fb: **New feature: Layers!** Layers act as groups and, more importantly, allow you to perform blend operations on them. Each layer allows you to specify an `opacity` (the factor at which the layer will be mixed in; defaults to `1`) and optionally a `blend` operation, which can be a function, or a the name of one of the provided blend functions. Some examples (all of these are roughlt equivalent):

  ```tsx
  <Layer blend={Blend.add}>
    <Modules.Fresnel />
  </Layer>

  <Layer opacity={Fresnel()} blend="add">
    <Modules.Color color="white" />
  </Layer>

  <Layer blend={(a, b) => Add(a, Mul(b, Fresnel()))}>
    <Modules.Color color="white" />
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
