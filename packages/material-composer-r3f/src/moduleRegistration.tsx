import { Module } from "material-composer"
import { useEffect } from "react"
import { useMaterialContext } from "./ComposableMaterial"

export const useModuleRegistration = (module: Module) => {
  const { addModule, removeModule } = useMaterialContext()

  useEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])
}
