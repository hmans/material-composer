---
"material-composer": patch
---

`Translate`, `Velocity` and `Acceleration` now have a new `space` prop that allows the user to specify which reference space the given vector or offset exists in. Available options are:

`world` - The vector or offset is in world space. This is the default.
`local` - The vector or offset is in local space. (This includes the instance transform when used in an instanced rendering context.)
`view` - The vector or offset is in view space.

```tsx
<Modules.Translate offset={Mul(new Vector3(1, 0, 0), Sin(time))} space="view" />
```
