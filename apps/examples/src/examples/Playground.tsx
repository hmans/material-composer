import { patchMaterial } from "material-composer"
import { useMemo } from "react"
import { MeshStandardMaterial } from "three"

export default function Playground() {
  const material = useMemo(() => {
    const material = patchMaterial(new MeshStandardMaterial())
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
