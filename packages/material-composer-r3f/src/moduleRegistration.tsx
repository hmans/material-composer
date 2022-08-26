import { Module } from "material-composer"
import { createContext, useContext, useLayoutEffect } from "react"
import { MutableListAPI, useMutableList } from "./lib/use-mutable-list"

export const ModuleRegistrationContext = createContext<MutableListAPI<Module>>(
  null!
)

export const provideModuleRegistration = () => {
  const modules = useMutableList<Module>()

  return modules
}

export const useModuleRegistration = (module: Module) => {
  const { addItem, removeItem, version, bumpVersion } = useContext(
    ModuleRegistrationContext
  )

  useLayoutEffect(() => {
    if (!module) return

    bumpVersion()
    addItem(module)

    return () => {
      bumpVersion()
      removeItem(module)
    }
  }, [module])
}
