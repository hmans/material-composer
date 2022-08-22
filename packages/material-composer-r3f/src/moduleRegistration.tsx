import { Module } from "material-composer"
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState
} from "react"

export const ModuleRegistrationContext = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useMaterialContext = () => useContext(ModuleRegistrationContext)

export const provideModuleRegistration = () => {
  const [modules, setModules] = useState<Module[]>([])

  const addModule = useCallback((module: Module) => {
    setModules((modules) => [...modules, module])
  }, [])

  const removeModule = useCallback((module: Module) => {
    setModules((modules) => modules.filter((m) => m !== module))
  }, [])

  return { modules, addModule, removeModule }
}

export const useModuleRegistration = (module: Module) => {
  const { addModule, removeModule } = useMaterialContext()

  useLayoutEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])
}
