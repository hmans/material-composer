import { Camera } from "@react-three/fiber"
import {
  $,
  compileShader,
  Float,
  Input,
  Master,
  Unit,
  Vec3,
  VertexNormal,
  VertexPosition
} from "shader-composer"
import { MeshStandardMaterial, Scene, WebGLRenderer } from "three"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { ModulePipe, ModuleState, pipeModules } from "."

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ComposableMaterialArgs = Optional<iCSMParams, "baseMaterial"> & {
  modules: ModulePipe
}

const PATCHMAP = {
  csm_FragmentNormal: {
    "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>
    normal = normal + csm_FragmentNormal;
    `
  }
}

export class ComposableMaterial extends CustomShaderMaterial {
  private _modules: ModulePipe = []

  /**
   * The per-frame update function returned by compileShader.
   */
  private shaderMeta?: {
    update: (
      dt: number,
      camera: Camera,
      scene: Scene,
      renderer: WebGLRenderer
    ) => void

    dispose: () => void
  }

  /**
   * The Shader Composer root node for this material.
   */
  public shaderRoot?: Unit

  constructor(
    {
      baseMaterial,
      ...args
    }: ComposableMaterialArgs = {} as ComposableMaterialArgs
  ) {
    super({
      baseMaterial: baseMaterial || MeshStandardMaterial,
      ...args,
      patchMap: PATCHMAP
    })

    if (args.modules) this.compileModules(args.modules)
  }

  public compileModules(modules: ModulePipe) {
    if (this._modules === modules) return
    this._modules = modules

    /* If we've already had a shader, dispose of it. */
    this.shaderMeta?.dispose()

    /* Define an initial module state. */
    const initialState: ModuleState = {
      position: VertexPosition,
      normal: VertexNormal,
      color: Vec3($`csm_DiffuseColor.rgb`),
      alpha: Float($`csm_DiffuseColor.a`),
      roughness: Float($`csm_Roughness`),
      metalness: Float($`csm_Metalness`)
    }

    /* Transform state with given modules. */
    const state = pipeModules(initialState, ...(this._modules || []))

    /* Create a shader root. We're currently using CSM for everything, so
    always pick a CustomShaderMaterialMaster. */
    this.shaderRoot = CustomShaderMaterialMaster({
      position: state.position,
      normal: state.normal,
      diffuseColor: state.color,
      alpha: state.alpha,
      roughness: state.roughness,
      metalness: state.metalness
    })

    /* And finally compile a shader from the state. */
    const [shader, meta] = compileShader(this.shaderRoot)

    /* And let CSM know that it was updated. */
    super.update({ ...shader, cacheKey: () => String(Math.random()) })

    this.shaderMeta = meta
  }

  tick(dt: number, camera: Camera, scene: Scene, renderer: WebGLRenderer) {
    this.shaderMeta?.update(dt, camera, scene, renderer)
  }

  dispose() {
    this.shaderMeta?.dispose()
    super.dispose()
  }
}

export type CustomShaderMaterialMasterProps = {
  position?: Input<"vec3">
  normal?: Input<"vec3">
  diffuseColor?: Input<"vec3">
  emissiveColor?: Input<"vec3">
  fragColor?: Input<"vec3">
  alpha?: Input<"float">
  roughness?: Input<"float">
  metalness?: Input<"float">
}

export const CustomShaderMaterialMaster = ({
  position,
  normal,
  diffuseColor,
  emissiveColor,
  fragColor,
  roughness,
  metalness,
  alpha
}: CustomShaderMaterialMasterProps = {}) =>
  Master({
    name: "CustomShaderMaterial Master",

    vertex: {
      body: $`
				${position !== undefined ? $`csm_Position.xyz = ${position};` : ""}
				${normal !== undefined ? $`csm_Normal = ${normal};` : ""}
			`
    },

    fragment: {
      header: $`vec3 csm_FragmentNormal;`,
      body: $`
        vec3 csm_FragmentNormal = vNormal;

        ${alpha !== undefined ? $`csm_DiffuseColor.a = ${alpha};` : ""}
				${diffuseColor !== undefined ? $`csm_DiffuseColor.rgb = ${diffuseColor};` : ""}
				${emissiveColor !== undefined ? $`csm_Emissive = ${emissiveColor};` : ""}
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
