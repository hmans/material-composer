---
"material-composer": patch
"material-composer-r3f": patch
---

**New feature: Layers!** Layers act as groups and, more importantly, allow you to perform blend operations on them. Each layer allows you to specify an `opacity` (the factor at which the layer will be mixed in; defaults to `1`) and optionally a `blend` operation, which can be a function, or a the name of one of the provided blend functions. Some examples (all of these are roughlt equivalent):

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
