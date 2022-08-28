import {
  PatchedMaterialOptions,
  patchMaterial
} from "@material-composer/patch-material"
import { MaterialNode, Node } from "@react-three/fiber"
import { forwardRef, useImperativeHandle, useLayoutEffect } from "react"
import {
  IUniform,
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial
} from "three"
import { useManagedInstance } from "./useManagedInstance"

type Constructor<T> = new (...args: any[]) => T

type Uniforms = Record<string, IUniform<any>>

type PatchedMaterialProps<C extends Constructor<Material>> = MaterialNode<
  InstanceType<C>,
  C
> & { vertexShader?: string; fragmentShader?: string; uniforms?: Uniforms }

const makePatchedMaterialComponent = <
  C extends Constructor<M>,
  M extends Material
>(
  ctor: C
) =>
  forwardRef<M, PatchedMaterialProps<C>>(
    ({ args = [], vertexShader, fragmentShader, uniforms, ...props }, ref) => {
      /* Create a new material instance any time the shader-related props change. */
      const material = useManagedInstance(
        () =>
          patchMaterial(new ctor(...(args as any)), {
            vertexShader,
            fragmentShader,
            uniforms
          }),
        [vertexShader, fragmentShader, uniforms]
      )

      useImperativeHandle(ref, () => material)

      return <primitive object={material} {...props} />
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
}
