---
"material-composer": minor
---

**Breaking Change**: `Translate` now no longer performs any space transformations on the given `offset`. The user is expected to perform this themselves. (For example, if you're animating particles, you may want to transform the offset you intend to apply to instance space first.)
