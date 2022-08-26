import { $, Input, Mix, type, Unit } from "shader-composer"
import { ModuleFactory, ModulePipe, pipeModules } from "."

export type BlendableType = "float" | "vec2" | "vec3" | "vec4"

export type BlendFunction = <T extends BlendableType>(
  a: Input<T>,
  b: Input<T>,
  opacity: Input<"float">
) => Input<T>

export type BlendMode = "normal" | "add" | "discard"

/* TODO: implement additional blend modes */

export const Blend: Record<BlendMode, BlendFunction> = {
  normal: (a, b, f) => (f === 1 ? b : f === 0 ? a : Mix(a, b, f)),
  discard: (a) => a,
  add: (a, b, f) =>
    Unit(type(a), $`min(${a} + ${b}, 1.0) * ${f} + ${a} * (1.0 - ${f})`)
}

export type LayerArgs = {
  modules?: ModulePipe
  opacity?: Input<"float">
  blend?: BlendFunction | BlendMode
}

export const Layer: ModuleFactory<LayerArgs> = ({
  modules = [],
  opacity = 1,
  blend = Blend.normal
}) => (state) => {
  /* Determine new state */
  const newState = pipeModules(state, ...modules)

  /* Determine blend function */
  const blendFunction = typeof blend === "string" ? Blend[blend] : blend

  return {
    color: blendFunction(state.color, newState.color, opacity),
    position: Blend.normal(state.position, newState.position, opacity),
    alpha: Blend.normal(state.alpha, newState.alpha, opacity),
    normal: Blend.normal(state.normal, newState.normal, opacity),
    roughness: Blend.normal(state.roughness, newState.roughness, opacity),
    metalness: Blend.normal(state.metalness, newState.metalness, opacity)
  }
}
