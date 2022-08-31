---
"@material-composer/patch-material": patch
---

Fixes Three.js material caching by setting a randomized cache key value every time a material is patched. (We will probably revisit this in the future to allow Three.js to reuse compiled programs more efficiently.)
