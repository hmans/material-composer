import {
  PatchedMaterialMaster,
  patchMaterial
} from "@material-composer/patch-material"
import { useMemo } from "react"
import { Lerp, Time } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color, MeshStandardMaterial } from "three"

export default function Playground() {
  const shader = useShader(() => {
    return PatchedMaterialMaster({
      diffuseColor: Lerp(new Color("red"), new Color("yellow"), Time()),
      metalness: 0.5,
      roughness: 0.5,
      alpha: 1
    })
  })

  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({
        color: "hotpink",
        transparent: true
      }),
      shader
    )

    return material
  }, [shader])

  return (
    <group position-y={1.5}>
      <mesh castShadow material={material}>
        <sphereGeometry />
      </mesh>
    </group>
  )
}
