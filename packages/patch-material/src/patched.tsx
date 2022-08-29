import { Constructor } from "@hmans/types"
import { MaterialNode, Node } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect } from "react"
import {
  IUniform,
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial
} from "three"
import { useManagedInstance } from "./lib/useManagedInstance"
import { PatchedMaterialOptions, patchMaterial } from "./patchMaterial"

export type ShaderProps = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, IUniform<any>>
}

export type PatchedMaterialProps<
  C extends Constructor<Material>
> = MaterialNode<InstanceType<C>, C> & ShaderProps

export const makePatchedMaterialComponent = <
  C extends Constructor<M>,
  M extends Material
>(
  ctor: C
) =>
  forwardRef<M, PatchedMaterialProps<C>>(
    ({ args = [], vertexShader, fragmentShader, uniforms, ...props }, ref) => {
      /* Create a new material instance any time the shader-related props change. */
      const material = useManagedInstance(() => new ctor(...(args as any)), [
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
  MeshStandardMaterial: makePatchedMaterialComponent(MeshStandardMaterial),
  MeshPhysicalMaterial: makePatchedMaterialComponent(MeshPhysicalMaterial),

  MaterialInstance: <M extends Material>({
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
