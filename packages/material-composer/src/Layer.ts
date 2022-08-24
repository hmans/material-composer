import { Input, Mix } from "shader-composer"
import { initialModuleState, ModuleFactory, ModulePipe, pipeModules } from "."

export type LayerOptions = {
  modules?: ModulePipe
  mix?: Input<"float">
}

export const Layer: ModuleFactory<LayerOptions> = ({
  modules = [],
  mix = 1
}) => (state) => {
  const newState = pipeModules(initialModuleState(), ...modules)

  return {
    position: Mix(state.position, newState.position, mix),
    normal: Mix(state.normal, newState.normal, mix),
    alpha: Mix(state.alpha, newState.alpha, mix),
    color: Mix(state.color, newState.color, mix),
    metalness: Mix(state.metalness, newState.metalness, mix),
    roughness: Mix(state.roughness, newState.roughness, mix)
  }
}
