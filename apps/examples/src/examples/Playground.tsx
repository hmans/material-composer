import { extend } from "@material-composer/patch-material"
import { patchMaterial } from "material-composer"
import { useMemo } from "react"
import { pipe } from "shader-composer"
import { MeshPhysicalMaterial, MeshStandardMaterial } from "three"

export default function Playground() {
  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({
        color: "hotpink",
        metalness: 0.6,
        roughness: 0.5
      })
    )

    material.onBeforeCompile = (shader) => {
      if (
        material instanceof MeshStandardMaterial ||
        material instanceof MeshPhysicalMaterial
      ) {
        shader.fragmentShader = pipe(
          shader.fragmentShader,

          extend("void main() {").with(`
            float csm_Roughness = roughness;
            float csm_Metalness = metalness;
          `),

          extend("#include <roughnessmap_fragment>").with(
            "roughnessFactor = csm_Roughness;"
          ),

          extend("#include <metalnessmap_fragment>").with(
            "metalnessFactor = csm_Metalness;"
          )
        )
      }

      shader.fragmentShader = pipe(
        shader.fragmentShader,

        extend("void main() {").with(`
          vec3 csm_DiffuseColor = diffuse;
          float csm_Alpha = opacity;
        `),

        extend("#include <color_fragment>").with(
          "diffuseColor = vec4(csm_DiffuseColor, csm_Alpha);"
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
