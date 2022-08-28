import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { initialModuleState, Module, pipeModules } from "material-composer"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "material-composer-r3f/src/moduleRegistration"
import { DependencyList, useMemo } from "react"
import { useShader } from "shader-composer-r3f"
import { patched } from "./patched"

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

const useModules = (modules: Module[], deps?: DependencyList) => {
  const root = useMemo(() => {
    /* Transform state with given modules. */
    const { color, ...state } = pipeModules(
      initialModuleState(),
      ...(modules || [])
    )

    /* Construct a shader master unit */
    return PatchedMaterialMaster({
      ...state,
      diffuseColor: color
    })
  }, deps)

  return useShader(() => root, [root])
}

export const composed = new Proxy(patched, {
  get: (target, key) => {
    if (!hasKey(target, key)) return

    const Component = target[key]

    return ({ children, ...props }: any) => {
      const modules = provideModuleRegistration()

      const shader = useModules(modules.list, [modules.version])

      return (
        <Component {...props} {...shader}>
          <ModuleRegistrationContext.Provider value={modules}>
            {children}
          </ModuleRegistrationContext.Provider>
        </Component>
      )
    }
  }
})
