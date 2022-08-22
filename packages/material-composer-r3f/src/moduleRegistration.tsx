import { useVersion } from "@hmans/use-version"
import { Module } from "material-composer"
import { useCallback, useEffect, useState } from "react"
import { useMaterialContext } from "./ComposableMaterial"

export const provideModuleRegistration = () => {
  const [version, bumpVersion] = useVersion()
  const [modules, setModules] = useState<Module[]>([])

  const addModule = useCallback((module: Module) => {
    setModules((modules) => [...modules, module])
    bumpVersion()
  }, [])

  const removeModule = useCallback((module: Module) => {
    setModules((modules) => modules.filter((m) => m !== module))

    bumpVersion()
  }, [])

  return { version, modules, addModule, removeModule }
}

export const useModuleRegistration = (module: Module) => {
  const { addModule, removeModule } = useMaterialContext()

  useEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])
}
