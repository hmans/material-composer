import { Camera } from "@react-three/fiber"
import {
  compileShader,
  CustomShaderMaterialMaster,
  Unit
} from "shader-composer"
import { MeshStandardMaterial, Scene, WebGLRenderer } from "three"
import CustomShaderMaterial, {
  iCSMParams
} from "three-custom-shader-material/vanilla"
import { initialModuleState, ModulePipe, pipeModules } from "."

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ComposableMaterialArgs = Optional<iCSMParams, "baseMaterial"> & {
  modules: ModulePipe
}

export class ComposableMaterial extends CustomShaderMaterial {
  /**
   * The per-frame update function returned by compileShader.
   */
  private shaderMeta?: ReturnType<typeof compileShader>[1]

  /**
   * The Shader Composer root node for this material.
   */
  public shaderRoot?: Unit

  constructor(
    {
      baseMaterial = MeshStandardMaterial,
      ...args
    }: ComposableMaterialArgs = {} as ComposableMaterialArgs
  ) {
    super({ baseMaterial, ...args })
    if (args.modules) this.compileModules(args.modules)
  }

  public compileModules(modules: ModulePipe) {
    /* If we've already had a shader, dispose of it. */
    this.shaderMeta?.dispose()

    /* Transform state with given modules. */
    const { color, ...state } = pipeModules(
      initialModuleState(),
      ...(modules || [])
    )

    /* Create a shader root. We're currently using CSM for everything, so
    always pick a CustomShaderMaterialMaster. */
    this.shaderRoot = CustomShaderMaterialMaster({
      ...state,
      diffuseColor: color
    })

    /* And finally compile a shader from the state. */
    const [shader, meta] = compileShader(this.shaderRoot)

    if (this.isMeshDepthMaterial) {
      shader.fragmentShader = ""
    }

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
