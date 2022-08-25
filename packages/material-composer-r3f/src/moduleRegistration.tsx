import { useList } from "@hmans/use-list"
import { Module } from "material-composer"
import { createContext, useContext, useLayoutEffect, useMemo } from "react"

export const ModuleRegistrationContext = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const provideModuleRegistration = () => {
  const [modules, addModule, removeModule] = useList<Module>()

  const api = useMemo(() => ({ addModule, removeModule }), [
    addModule,
    removeModule
  ])

  return [modules, api] as const
}

export const useModuleRegistration = (module: Module) => {
  const { addModule, removeModule } = useContext(ModuleRegistrationContext)

  useLayoutEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])
}
