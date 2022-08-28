import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { useControls } from "leva"
import { initialModuleState, pipeModules } from "material-composer"
import { Modules } from "material-composer-r3f"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "material-composer-r3f/src/moduleRegistration"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { compileShader } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { patched } from "./lib/patched"

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

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <composed.MeshStandardMaterial>
          <Modules.Color color="hotpink" />
        </composed.MeshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
