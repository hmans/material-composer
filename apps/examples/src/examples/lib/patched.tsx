import { patchMaterial } from "@material-composer/patch-material"
import { MaterialNode } from "@react-three/fiber"
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
) => ({
  args = [],
  vertexShader,
  fragmentShader,
  uniforms,
  ...props
}: PatchedMaterialProps<C>) => {
  const material = useManagedInstance(
    () =>
      patchMaterial(new ctor(...(args as any)), {
        vertexShader,
        fragmentShader,
        uniforms
      }),
    [vertexShader, fragmentShader, uniforms]
  )

  return <primitive object={material} {...props} />
}

export const patched = {
  MeshStandardMaterial: makePatchedMaterialComponent(MeshStandardMaterial),
  MeshPhysicalMaterial: makePatchedMaterialComponent(MeshPhysicalMaterial)
}
