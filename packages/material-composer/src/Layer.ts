import { Input, Mix } from "shader-composer"
import { initialModuleState, ModuleFactory, ModulePipe, pipeModules } from "."

export type LayerOptions = {
  modules?: ModulePipe
  blend?: Input<"float">
}

export const Layer: ModuleFactory<LayerOptions> = ({
  modules = [],
  blend = 1
}) => (state) => {
  const newState = pipeModules(state, ...modules)

  return {
    position: Mix(state.position, newState.position, blend),
    normal: Mix(state.normal, newState.normal, blend),
    alpha: Mix(state.alpha, newState.alpha, blend),
    color: Mix(state.color, newState.color, blend),
    metalness: Mix(state.metalness, newState.metalness, blend),
    roughness: Mix(state.roughness, newState.roughness, blend)
  }
}
