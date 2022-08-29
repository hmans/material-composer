import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { initialModuleState, Module, pipeModules } from "material-composer"
import React, { DependencyList, useMemo } from "react"
import { useShader } from "shader-composer-r3f"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

export const useModules = (modules: Module[], deps?: DependencyList) => {
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

export const composable = new Proxy(patched, {
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
