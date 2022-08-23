import { Add, Fresnel as FresnelUnit, FresnelProps } from "shader-composer"
import { ModuleFactory } from ".."

export type FresnelArgs = FresnelProps

export const Fresnel: ModuleFactory<FresnelArgs> = (props) => (state) => ({
  ...state,
  color: Add(state.color, FresnelUnit(props))
})
