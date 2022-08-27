import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import { patchMaterial } from "@material-composer/patch-material"

export default function Playground() {
  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({
        color: "hotpink",
        metalness: 0.6,
        roughness: 0.5
      })
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
