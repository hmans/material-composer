import { Add, Input, Mul, pipe } from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Module, ModuleFactory } from ".."

export * from "./Acceleration"
export * from "./Alpha"
export * from "./Billboard"
export * from "./Color"
export * from "./Fresnel"
export * from "./Gradient"
export * from "./Lifetime"
export * from "./Rotate"
export * from "./Scale"
export * from "./Softness"
export * from "./Translate"
export * from "./Velocity"

export const CustomModule = ({ module }: { module: Module }): Module => module

export type DistortSurfaceProps = {
  offset?: Input<"vec3" | "float">
  amplitude?: Input<"float">
}

export const DistortSurface: ModuleFactory<DistortSurfaceProps> = ({
  offset = 1,
  amplitude = 1
}) => (state) => {
  const displacement = pipe(
    state.position,
    (v) => Add(v, offset),
    (v) => PSRDNoise3D(v),
    (v) => Mul(v, amplitude)
  )

  const position = pipe(
    displacement,
    (v) => Mul(state.normal, v),
    (v) => Add(state.position, v)
  )

  return { ...state, position }
}
