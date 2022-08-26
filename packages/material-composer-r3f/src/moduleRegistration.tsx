import { Module } from "material-composer"
import { createContext, useContext, useLayoutEffect } from "react"
import { MutableListAPI, useMutableList } from "./lib/use-mutable-list"

export const ModuleRegistrationContext = createContext<MutableListAPI<Module>>(
  null!
)

export const provideModuleRegistration = () => {
  const modules = useMutableList<Module>()

  useLayoutEffect(() => {
    console.log("Version has been bumped!", modules.version)
  }, [modules.version])

  return modules
}

export const useModuleRegistration = (module: Module) => {
  const { addItem, removeItem, version, bumpVersion, updateItem } = useContext(
    ModuleRegistrationContext
  )

  useLayoutEffect(() => {
    if (!module) return
    console.log("Registering new module!", JSON.stringify(module))

    bumpVersion()
    addItem(module)

    return () => {
      bumpVersion()
      removeItem(module)
    }
  }, [module])
}
