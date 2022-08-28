import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { initialModuleState, pipeModules } from "material-composer"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "material-composer-r3f/src/moduleRegistration"
import { useMemo } from "react"
import { compileShader } from "shader-composer"
import { patched } from "./patched"

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

export const composed = new Proxy(patched, {
  get: (target, key) => {
    if (!hasKey(target, key)) return

    const Component = target[key]

    return ({ children, ...props }: any) => {
      const modules = provideModuleRegistration()

      const shader = useMemo(() => {
        /* Transform state with given modules. */
        const { color, ...state } = pipeModules(
          initialModuleState(),
          ...(modules.list || [])
        )

        /* Construct a shader master unit */
        const root = PatchedMaterialMaster({
          ...state,
          diffuseColor: color
        })

        console.log(root)

        const [shader, meta] = compileShader(root)

        return shader
      }, [modules.version])

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
