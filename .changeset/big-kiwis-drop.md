---
"material-composer": patch
"material-composer-r3f": patch
---

Renamed `Layer`'s `mix` argument/prop to `opacity`, and added a new `blend`. This prop can take a blend function, or the name of one of the blend functions defined in the new `Blend` export. Its arguments are the original color, the new color, and the value of the `opacity` prop.

The following three are now equivalent (in JSX, but the same applies to the imperative version of `Layer`):

```tsx
<Layer blend="add">
  <Modules.Fresnel />
</Layer>

<Layer opacity={Fresnel()} blend="add">
  <Modules.Color color="white" />
</Layer>

<Layer blend={(a, b) => Add(a, Mul(b, Fresnel()))}>
  <Modules.Color color="white" />
</Layer>
```
