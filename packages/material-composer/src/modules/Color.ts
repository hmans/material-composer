import { Input } from "shader-composer"
import { ModuleFactory } from ".."

export type ColorArgs = {
  color: Input<"vec3">
}

export const Color: ModuleFactory<ColorArgs> = ({ color }) => (state) => ({
  ...state,
  color
})
