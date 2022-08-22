import { Input, Mix } from "shader-composer"
import { ModuleFactory, ModulePipe, pipeModules } from ".."

export type LayerProps = {
  modules?: ModulePipe
  mix?: Input<"float">
}

export const Layer: ModuleFactory<LayerProps> = ({
  modules = [],
  mix = 0.5
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
    color: Mix(state.color, newState.color, mix)
  }
}
