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
    bumpVersion()
    return () => bumpVersion()
  }, [module])

  /*
  Only ever mutate the lists on a version change. This guarantees that we
  will do it sequentially.
  */
  useLayoutEffect(() => {
    if (!module) return

    addItem(module)
    return () => removeItem(module)
  }, [version])
}
