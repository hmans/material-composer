import {
  Add,
  Gradient,
  Input,
  Mul,
  OneMinus,
  pipe,
  Smoothstep,
  Unit
} from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import * as THREE from "three"
import { Module, ModuleFactory } from ".."
import { Heat, HeatOptions } from "../units"

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

export type PlasmaProps = HeatOptions & {
  color?: (heat: Input<"float">) => Unit<"vec3">
}

export const Plasma: ModuleFactory<PlasmaProps> = ({
  color = (heat: Input<"float">) =>
    Gradient(
      heat,
      [new THREE.Color("#457b9d"), 0.85],
      [new THREE.Color("#a2d2ff"), 0.95],
      [new THREE.Color("white").multiplyScalar(3), 0.975]
    ),
  offset,
  scale = 0.5,
  octaves = 3,
  power = 1
}) => (state) => {
  const heat = OneMinus(Heat(state.position, { offset, scale, octaves, power }))
  const alpha = Smoothstep(0.7, 0.9, heat)

  return {
    ...state,
    alpha,
    color: color(heat)
  }
}

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
