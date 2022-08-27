import { patchMaterial } from "@material-composer/patch-material"
import { applyProps, MaterialNode, Node } from "@react-three/fiber"
import { useLayoutEffect, useMemo } from "react"
import { IUniform, Material, MeshStandardMaterial } from "three"

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
) => ({
  args = [],
  vertexShader,
  fragmentShader,
  uniforms,
  ...props
}: PatchedMaterialProps<C>) => {
  const material = useMemo<M>(() => {
    return patchMaterial(new ctor(...(args as any)), {
      vertexShader,
      fragmentShader,
      uniforms
    })
  }, [vertexShader, fragmentShader, uniforms])

  useLayoutEffect(() => {
    applyProps(material as any, props as any)
  }, [material, props])

  return <primitive object={material} />
}

export const patched = {
  MeshStandardMaterial: makePatchedMaterialComponent(MeshStandardMaterial)
}
