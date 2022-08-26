import { Fresnel as FresnelUnit, FresnelProps } from "shader-composer"
import { ModuleFactory } from ".."
import { Layer } from "../Layer"
import { Color, ColorArgs } from "./Color"

export type FresnelArgs = FresnelProps & ColorArgs

export const Fresnel: ModuleFactory<FresnelArgs> = ({
  color = "white",
  ...props
}) =>
  Layer({
    mix: FresnelUnit(props),
    modules: [Color({ color })]
  })
