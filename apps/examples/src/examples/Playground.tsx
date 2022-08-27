import {
  PatchedMaterialMaster,
  patchMaterial
} from "@material-composer/patch-material"
import { useMemo } from "react"
import { useShader } from "shader-composer-r3f"
import { Color, MeshStandardMaterial } from "three"

export default function Playground() {
  const shader = useShader(() => {
    return PatchedMaterialMaster({
      diffuseColor: new Color("red"),
      metalness: 1,
      roughness: 0.5,
      alpha: 0.5
    })
  })

  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({
        color: "hotpink",
        transparent: true
      }),
      shader.fragmentShader
    )

    return material
  }, [])

  return (
    <group position-y={1.5}>
      <mesh castShadow material={material}>
        <sphereGeometry />
      </mesh>
    </group>
  )
}
