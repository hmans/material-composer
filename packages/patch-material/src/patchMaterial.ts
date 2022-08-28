import {
  IUniform,
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial
} from "three"
import { flow, pipe } from "fp-ts/function"

export type PatchedMaterialOptions = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: IUniform }
}

export const patchMaterial = <M extends Material>(
  material: M,
  opts: PatchedMaterialOptions = {}
) => {
  material.onBeforeCompile = (shader) => {
    /* Inject custom programs */
    shader.fragmentShader = pipe(
      shader.fragmentShader,
      injectGlobalDefines(material),
      injectProgram(opts.fragmentShader)
    )

    shader.vertexShader = pipe(
      shader.vertexShader,
      injectGlobalDefines(material),
      injectProgram(opts.vertexShader)
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

    shader.vertexShader = pipe(
      shader.vertexShader,

      extend("void main() {").with(`
        vec3 csm_Position = position;
        vec3 csm_Normal = normal;
      `),

      extend("#include <begin_vertex>").with("transformed = csm_Position;"),

      replace("#include <beginnormal_vertex>").with(`
        vec3 objectNormal = csm_Normal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif
      `)
    )

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

    shader.uniforms = { ...shader.uniforms, ...opts.uniforms }
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

export const injectGlobalDefines = (material: Material) =>
  flow(
    prepend("void main() {").with(`
      #define IS_${material.type.toUpperCase()};
    `)
  )

export const extend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${anchor}\n${target}`)
})

export const prepend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${target}\n${anchor}`)
})

export const replace = (anchor: string) => ({
  with: (target: string) => (source: string) => source.replace(anchor, target)
})

export const injectProgram = (program: string | undefined) => (
  source: string
) => {
  if (!program) return source

  const parsed = parseProgram(program)
  if (!parsed) return source

  return pipe(
    source,
    prepend("void main() {").with(parsed.header),
    extend("void main() {").with(parsed.body)
  )
}
