import { Constructor } from "@hmans/types"
import {
  PatchedMaterialOptions,
  patchMaterial
} from "@material-composer/patch-material"
import { MaterialNode, Node } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect } from "react"
import * as THREE from "three"
import { useManagedPrimitive } from "./lib/useManagedInstance"

export type ShaderProps = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, THREE.IUniform<any>>
}

export type PatchedMaterialProps<
  C extends Constructor<THREE.Material>
> = MaterialNode<InstanceType<C>, C> & ShaderProps

export const makePatchedMaterialComponent = <
  C extends Constructor<M>,
  M extends THREE.Material
>(
  ctor: C
) =>
  forwardRef<M, PatchedMaterialProps<C>>(
    ({ args = [], vertexShader, fragmentShader, uniforms, ...props }, ref) => {
      /* Create a new material instance any time the shader-related props change. */
      const material = useManagedPrimitive(() => new ctor(...(args as any)), [
        vertexShader,
        fragmentShader,
        uniforms
      ])

      /* Patch newly created materials */
      useLayoutEffect(() => {
        patchMaterial(material, {
          vertexShader,
          fragmentShader,
          uniforms
        })
      }, [material])

      return <primitive object={material} ref={ref} {...props} />
    }
  )

export const patched = {
  LineBasicMaterial: makePatchedMaterialComponent(THREE.LineBasicMaterial),
  LineDashedMaterial: makePatchedMaterialComponent(THREE.LineDashedMaterial),
  MeshBasicMaterial: makePatchedMaterialComponent(THREE.MeshBasicMaterial),
  MeshDepthMaterial: makePatchedMaterialComponent(THREE.MeshDepthMaterial),
  MeshDistanceMaterial: makePatchedMaterialComponent(
    THREE.MeshDistanceMaterial
  ),
  MeshLambertMaterial: makePatchedMaterialComponent(THREE.MeshLambertMaterial),
  MeshMatcapMaterial: makePatchedMaterialComponent(THREE.MeshMatcapMaterial),
  MeshNormalMaterial: makePatchedMaterialComponent(THREE.MeshNormalMaterial),
  MeshPhongMaterial: makePatchedMaterialComponent(THREE.MeshPhongMaterial),
  MeshPhysicalMaterial: makePatchedMaterialComponent(
    THREE.MeshPhysicalMaterial
  ),
  MeshStandardMaterial: makePatchedMaterialComponent(
    THREE.MeshStandardMaterial
  ),
  MeshToonMaterial: makePatchedMaterialComponent(THREE.MeshToonMaterial),
  PointsMaterial: makePatchedMaterialComponent(THREE.PointsMaterial),
  RawShaderMaterial: makePatchedMaterialComponent(THREE.RawShaderMaterial),
  ShaderMaterial: makePatchedMaterialComponent(THREE.ShaderMaterial),
  ShadowMaterial: makePatchedMaterialComponent(THREE.ShadowMaterial),
  SpriteMaterial: makePatchedMaterialComponent(THREE.SpriteMaterial),

  /**
   * Use `patched.Material` when you already have an instance of a material
   * that you want to patch (eg. a material loded from a GLTF, or one that uses
   * a custom material class.)
   *
   * @example
   * ```jsx
   * <patched.Material instance={myMaterial} {...shader} />
   * ```
   */
  Material: <M extends THREE.Material>({
    instance,
    vertexShader,
    fragmentShader,
    uniforms,
    ...props
  }: {
    instance: M
  } & Node<M, any> &
    PatchedMaterialOptions) => {
    useLayoutEffect(() => {
      patchMaterial(instance, { vertexShader, fragmentShader, uniforms })
    }, [instance, vertexShader, fragmentShader, uniforms])

    return <primitive object={instance} {...props} />
  }
} as const
