import { Add, Input } from "shader-composer"
import { ModuleFactory } from ".."

type TranslateProps = {
  /** The offset to apply. */
  offset: Input<"vec3">
}

/**
 * Applies an offset to the vertex position. The user is expected to provide
 * the offset in the intended space; no further transformation is performed.
 */
export const Translate: ModuleFactory<TranslateProps> = ({ offset }) => (
  state
) => ({
  ...state,
  position: Add(state.position, offset)
})
