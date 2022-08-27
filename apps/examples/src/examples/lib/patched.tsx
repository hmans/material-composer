import { patchMaterial } from "@material-composer/patch-material"
import { MaterialNode } from "@react-three/fiber"
import { DependencyList, useLayoutEffect, useMemo } from "react"
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
  const material = useManagedInstance(() => {
    const material = new ctor(...(args as any))
    return patchMaterial(material, { vertexShader, fragmentShader, uniforms })
  }, [vertexShader, fragmentShader, uniforms])

  return <primitive object={material} {...props} />
}

export const patched = {
  MeshStandardMaterial: makePatchedMaterialComponent(MeshStandardMaterial)
}

const useManagedInstance = <T extends any>(
  factory: () => T,
  deps: DependencyList = []
) => {
  const instance = useMemo(() => factory(), deps)
  useLayoutEffect(() => () => (instance as any).dispose?.(), [instance])
  return instance
}
