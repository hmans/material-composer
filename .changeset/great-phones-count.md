---
"material-composer": patch
"material-composer-r3f": patch
---

Refactored `ComposableMaterial.compileModules()` to take the new modules as an argument, and return early if the object is equal to the last list of modules that were used. This fixes some unwanted recompiles in React scenarios.
