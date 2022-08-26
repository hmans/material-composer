import { Input, Mix } from "shader-composer"
import { ModuleFactory, ModulePipe, ModuleState, pipeModules } from "."

export type LayerOptions = {
  modules?: ModulePipe
  mix?: Input<"float">
}

export const Layer: ModuleFactory<LayerOptions> = ({
  modules = [],
  mix = 1
}) => (state) => {
  const newState = pipeModules(state, ...modules)

  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => {
      const newValue = newState[key as keyof ModuleState]
      return [
        key,
        mix === 1 ? newValue : mix === 0 ? value : Mix(value, newValue, mix)
      ]
    })
  ) as ModuleState
}
