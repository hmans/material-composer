import {
  Input,
  Mix,
  Mul,
  pipe,
  Smoothstep,
  VertexPosition
} from "shader-composer"
import { ModuleFactory } from ".."

export type GradientArgs = {
  colorA: Input<"vec3">
  colorB: Input<"vec3">
  contrast?: Input<"float">
}

export const Gradient: ModuleFactory<GradientArgs> = ({
  colorA,
  colorB,
  contrast = 1
}) => (state) => ({
  ...state,
  color: pipe(
    VertexPosition.y,
    (v) => Mul(v, contrast),
    (v) => Smoothstep(1, -1, v),
    (v) => Mix(colorA, colorB, v)
  )
})
