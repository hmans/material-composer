import { Input, Mix } from "shader-composer"
import { ModuleFactory, ModulePipe, pipeModules } from "."

export type LayerOptions = {
  modules?: ModulePipe
  mix?: Input<"float">
}

export const Layer: ModuleFactory<LayerOptions> = ({
  modules = [],
  mix = 1
}) => (state) => {
  // TODO: each layer should start with the intitial state!
  const newState = pipeModules(
    {
      ...state,
      alpha: 1
    },
    ...modules
  )

  return {
    position: Mix(state.position, newState.position, mix),
    normal: Mix(state.normal, newState.normal, mix),
    alpha: Mix(state.alpha, newState.alpha, mix),
    color: Mix(state.color, newState.color, mix),
    metalness: Mix(state.metalness, newState.metalness, mix),
    roughness: Mix(state.roughness, newState.roughness, mix),
    fragNormal: Mix(state.fragNormal, newState.fragNormal, mix)
  }
}
