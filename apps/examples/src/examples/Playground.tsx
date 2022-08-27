import { patchMaterial } from "material-composer"
import { useMemo } from "react"
import { pipe } from "shader-composer"
import { MeshStandardMaterial } from "three"

const extend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${anchor}\n${target}`)
})

export default function Playground() {
  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({ color: "hotpink" })
    )

    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = pipe(
        shader.fragmentShader,

        extend("void main() {").with(`
          vec3 csm_DiffuseColor = diffuse;
          float csm_Alpha = opacity;
        `),

        extend("#include <color_fragment>").with(
          "diffuseColor = vec4(csm_DiffuseColor, csm_Alpha);"
        ),

        extend("#include <roughnessmap_fragment>").with(
          "roughnessFactor = 0.5;"
        )
      )
    }

    return material
  }, [])

  return (
    <group position-y={1.5}>
      <mesh castShadow material={material}>
        <sphereGeometry />
      </mesh>
    </group>
  )
}
