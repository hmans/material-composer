import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three"
import { pipe } from "fp-ts/function"

export const extend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${anchor}\n${target}`)
})

export const prepend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${target}\n${anchor}`)
})

export const patchMaterial = (material: Material, fragmentShader: string) => {
  const frag = parseProgram(fragmentShader)

  material.onBeforeCompile = (shader) => {
    /* Inject custom programs */
    shader.fragmentShader = pipe(
      shader.fragmentShader,
      prepend("void main() {").with(frag.header),
      extend("void main() {").with(frag.body)
    )

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

const parseProgram = (program: string) => {
  const r = new RegExp(/(.*)void\s+main\(\)\s+{(.*)}/s)
  const matches = r.exec(program)

  if (!matches) {
    throw new Error("Could not parse shader program. Boo!")
  }

  return {
    header: matches[1],
    body: matches[2]
  }
}
