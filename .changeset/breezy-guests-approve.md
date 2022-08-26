---
"material-composer": patch
---

The `Color` module can now accept a `THREE.ColorRepresentation` as its `color` argument:

```js
Modules.Color({ color: "hotpink" })
```

Or in JSX:

```jsx
<Modules.Color color="hotpink">
```
