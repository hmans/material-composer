import { patchMaterial } from "@material-composer/patch-material"
import { useControls } from "leva"
import { Layer } from "material-composer"
import * as Modules from "material-composer/modules"
import { Description } from "r3f-stage"
import { useLayoutEffect, useRef } from "react"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial } from "three"
import { patched } from "./lib/patched"
import { compileModules } from "./Vanilla"

type Constructor<T> = new (...args: any[]) => T

const makeComposedMaterialComponent = <N extends keyof typeof patched>(
  name: N
) => ({ children, ...props }: Parameters<typeof patched[N]>[0]) => {
  const material = useRef<MeshStandardMaterial>(null!)

  useLayoutEffect(() => {
    const modules = [
      Modules.Color({ color: "hotpink" }),
      Layer({ opacity: 0.5, modules: [Modules.Fresnel({})] })
    ]

    const [shader, meta] = compileModules(modules)
    patchMaterial(material.current, shader)
  }, [])

  const PatchedMaterialComponent = patched[name]

  return (
    <PatchedMaterialComponent ref={material} {...props}>
      {children}
    </PatchedMaterialComponent>
  )
}

export const composed = {
  MeshStandardMaterial: makeComposedMaterialComponent("MeshStandardMaterial")
}

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <composed.MeshStandardMaterial>
          {/* <Modules.Color color="hotpink" /> */}
        </composed.MeshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
