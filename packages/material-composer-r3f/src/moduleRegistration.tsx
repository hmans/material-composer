import { Module } from "material-composer"
import { createContext, useContext, useLayoutEffect } from "react"
import { useList } from "./lib/use-list"

export const ModuleRegistrationContext = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useMaterialContext = () => useContext(ModuleRegistrationContext)

export const provideModuleRegistration = () => {
  const [modules, addModule, removeModule] = useList<Module>()
  return { modules, addModule, removeModule }
}

export const useModuleRegistration = (module: Module) => {
  const { addModule, removeModule } = useMaterialContext()

  useLayoutEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])
}
