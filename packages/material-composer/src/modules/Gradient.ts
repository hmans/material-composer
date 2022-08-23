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
  /** Start color of the gradient. */
  colorA: Input<"vec3">
  /** End color of the gradient. */
  colorB: Input<"vec3">
  /** Contrast. Increase this above 1 to weigh the gradient towards its center. */
  contrast?: Input<"float">
  /** Position within the gradient. This defaults to the vertex position on the Y axis. */
  position?: Input<"float">
  /** Start of the range that the `position` value moves within. */
  start?: Input<"float">
  /** End of the range that the `position` value moves within. */
  stop?: Input<"float">
}

export const Gradient: ModuleFactory<GradientArgs> = ({
  colorA,
  colorB,
  contrast = 1,
  start = 1,
  stop = -1,
  position = VertexPosition.y
}) => (state) => ({
  ...state,
  color: pipe(
    position,
    (v) => Mul(v, contrast),
    (v) => Smoothstep(start, stop, v),
    (v) => Mix(colorA, colorB, v)
  )
})
