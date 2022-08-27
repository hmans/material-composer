import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three"
import { pipe } from "fp-ts/function"

export const extend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${anchor}\n${target}`)
})

export const patchMaterial = (material: Material) => {
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
}
