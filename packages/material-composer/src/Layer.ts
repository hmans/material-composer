import { $, Input, Mix, Vec3 } from "shader-composer"
import { ModuleFactory, ModulePipe, pipeModules } from "."

export type BlendFunction = (
  a: Input<"vec3">,
  b: Input<"vec3">,
  opacity: Input<"float">
) => Input<"vec3">

export type BlendMode = "normal" | "add" | "discard"

/* TODO: implement additional blend modes */

export const Blend: Record<BlendMode, BlendFunction> = {
  normal: (a, b, f) => (f === 1 ? b : f === 0 ? a : Mix(a, b, f)),
  discard: (a) => a,
  add: (a, b, f) => Vec3($`min(${a} + ${b}, 1.0) * ${f} + ${a} * (1.0 - ${f})`)
}

export type LayerArgs = {
  modules?: ModulePipe
  blendAmount?: Input<"float">
  blend?: BlendFunction | BlendMode
}

export const Layer: ModuleFactory<LayerArgs> = ({
  modules = [],
  blendAmount = 1,
  blend = Blend.normal
}) => (state) => {
  /* Determine new state */
  const newState = pipeModules(state, ...modules)

  /* Determine blend function */
  const blendFunction = typeof blend === "string" ? Blend[blend] : blend

  return {
    ...newState,
    color: blendFunction(state.color, newState.color, blendAmount)
  }
}
