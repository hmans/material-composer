---
"material-composer-r3f": patch
---

`<composable.*>` now supports a new `autoShadow` property. When set to true, a custom depth material will be automatically created and assigned to the mesh, inheriting the vertex shader part of the composed material.

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
