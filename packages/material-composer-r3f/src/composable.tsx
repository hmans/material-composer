import { patched } from "@material-composer/patched"
import { compileModules, Module } from "material-composer"
import React, { DependencyList, useMemo } from "react"
import { useShader } from "shader-composer-r3f"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

export const useModules = (modules: Module[], deps?: DependencyList) => {
  /* Compile modules into a shader graph */
  const root = useMemo(() => compileModules(modules), deps)

  /* Return shader compiled from graph */
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
