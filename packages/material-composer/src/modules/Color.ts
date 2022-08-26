import { Add, Input, vec3 } from "shader-composer"
import { Color as ColorImpl, ColorRepresentation } from "three"
import { ModuleFactory } from ".."

export type BlendFunction = (
  a: Input<"vec3">,
  b: Input<"vec3">
) => Input<"vec3">

export type BlendMode = "normal" | "add" | "discard"

export const Blend: Record<BlendMode, BlendFunction> = {
  normal: (a, b) => b,
  add: (a, b) => Add(a, b),
  discard: (a, b) => a
}

export type ColorArgs = {
  color: Input<"vec3"> | ColorRepresentation
  blend?: BlendFunction | BlendMode
}

export const Color: ModuleFactory<ColorArgs> = ({
  color,
  blend = Blend.normal
}) => (state) => {
  /* Determine new color */
  const newColor =
    typeof color === "string" || typeof color === "number"
      ? new ColorImpl(color)
      : color

  /* Determine blend function */
  const blendFunction = typeof blend === "string" ? Blend[blend] : blend

  /* Apply blending */
  const blendedColor = blendFunction(state.color, newColor)

  return {
    ...state,
    color: blendedColor
  }
}
