import { flow, identity, pipe } from "fp-ts/function"
import {
  IUniform,
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial
} from "three"

export type PatchedMaterialOptions = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: IUniform }
}

export const patchMaterial = <M extends Material>(
  material: M,
  opts: PatchedMaterialOptions = {}
) => {
  const supportsRoughnessAndMetalness =
    material instanceof MeshStandardMaterial ||
    material instanceof MeshPhysicalMaterial

  const transformVertexShader = flow(
    injectGlobalDefines(material),
    injectProgram(opts.vertexShader),
    injectPosition,
    injectNormal
  )

  const transformFragmentShader = flow(
    injectGlobalDefines(material),
    injectProgram(opts.fragmentShader),
    supportsRoughnessAndMetalness ? injectRoughnessAndMetalness : identity,
    injectDiffuseAndAlpha
  )

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = transformVertexShader(shader.vertexShader)
    shader.fragmentShader = transformFragmentShader(shader.fragmentShader)
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

const injectGlobalDefines = (material: Material) =>
  flow(
    prepend("void main() {").with(`#define IS_${material.type.toUpperCase()};`)
  )

const injectProgram = (program: string | undefined) => {
  if (!program) return identity

  const parsed = parseProgram(program)
  if (!parsed) return identity

  return flow(
    prepend("void main() {").with(parsed.header),
    extend("void main() {").with(parsed.body)
  )
}

const injectPosition = flow(
  extend("void main() {").with("vec3 csm_Position = position;"),
  extend("#include <begin_vertex>").with("transformed = csm_Position;")
)

const injectNormal = flow(
  extend("void main() {").with("vec3 csm_Normal = normal;"),
  replace("#include <beginnormal_vertex>").with(`
    vec3 objectNormal = csm_Normal;
    #ifdef USE_TANGENT
      vec3 objectTangent = vec3( tangent.xyz );
    #endif
  `)
)

const injectDiffuseAndAlpha = flow(
  extend("void main() {").with(`
    vec3 csm_DiffuseColor = diffuse;
    float csm_Alpha = opacity;
  `),
  extend("#include <color_fragment>").with(
    "diffuseColor = vec4(csm_DiffuseColor, csm_Alpha);"
  )
)

const injectRoughnessAndMetalness = flow(
  extend("void main() {").with("float csm_Roughness = roughness;"),
  extend("void main() {").with("float csm_Metalness = metalness;"),
  extend("#include <roughnessmap_fragment>").with(
    "roughnessFactor = csm_Roughness;"
  ),
  extend("#include <metalnessmap_fragment>").with(
    "metalnessFactor = csm_Metalness;"
  )
)
