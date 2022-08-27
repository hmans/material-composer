import {
  PatchedMaterialMaster,
  patchMaterial
} from "@material-composer/patch-material"
import { useMemo } from "react"
import {
  Cos,
  FragmentCoordinate,
  ScreenUV,
  Sin,
  Time,
  VertexPosition
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color, MeshStandardMaterial } from "three"

export default function Playground() {
  const shader = useShader(() => {
    return PatchedMaterialMaster({
      diffuseColor: new Color("red"),
      metalness: 0.5,
      roughness: 0.5,
      alpha: FragmentCoordinate.x
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
  }, [])

  return (
    <group position-y={1.5}>
      <mesh castShadow material={material}>
        <sphereGeometry />
      </mesh>
    </group>
  )
}
