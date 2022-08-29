import { $, Input, Master } from "shader-composer"

export type PatchedMaterialMasterProps = {
  position?: Input<"vec3">
  normal?: Input<"vec3">
  diffuseColor?: Input<"vec3">
  emissiveColor?: Input<"vec3">
  fragColor?: Input<"vec3">
  alpha?: Input<"float">
  roughness?: Input<"float">
  metalness?: Input<"float">
}

export const PatchedMaterialMaster = ({
  position,
  normal,
  diffuseColor,
  emissiveColor,
  fragColor,
  roughness,
  metalness,
  alpha
}: PatchedMaterialMasterProps = {}) =>
  Master({
    name: "PatchedMaterial Master",

    vertex: {
      body: $`
        ${position !== undefined ? $`csm_Position.xyz = ${position};` : ""}
        ${normal !== undefined ? $`csm_Normal = ${normal};` : ""}
      `
    },

    fragment: {
      body: $`
        ${alpha !== undefined ? $`csm_Alpha = ${alpha};` : ""}
        ${
          diffuseColor !== undefined
            ? $`csm_DiffuseColor = ${diffuseColor};`
            : ""
        }
        ${
          emissiveColor !== undefined ? $`csm_Emissive = ${emissiveColor};` : ""
        }
        ${
          fragColor !== undefined
            ? $`csm_FragColor = vec4(${fragColor}, ${alpha});`
            : ""
        }

        #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
          ${roughness !== undefined ? $`csm_Roughness = ${roughness};` : ""}
          ${metalness !== undefined ? $`csm_Metalness = ${metalness};` : ""}
        #endif
      `
    }
  })
