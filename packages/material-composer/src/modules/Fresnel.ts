import { Fresnel as FresnelUnit, FresnelProps, Mul } from "shader-composer"
import { Color } from "three"
import { ModuleFactory } from ".."

export type FresnelArgs = FresnelProps

export const Fresnel: ModuleFactory<FresnelArgs> = (props) => (state) => ({
  ...state,
  color: Mul(new Color("white"), FresnelUnit(props))
})
