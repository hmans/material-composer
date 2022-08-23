import { Input, Lerp } from "shader-composer"
import { ModuleFactory } from ".."

export type ColorArgs = {
  color: Input<"vec3">
  mix?: Input<"float">
}

export const Color: ModuleFactory<ColorArgs> = ({ color, mix = 1 }) => (
  state
) => ({
  ...state,
  color:
    mix === 1 ? color : mix === 0 ? state.color : Lerp(state.color, color, mix)
})
