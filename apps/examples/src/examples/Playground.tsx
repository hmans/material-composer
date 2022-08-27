import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import { patchMaterial } from "@material-composer/patch-material"
import { useShader } from "shader-composer-r3f"
import { $, Master, Unit } from "shader-composer"

export default function Playground() {
  const shader = useShader(() => {
    return Master({
      fragment: {
        body: $`
          csm_DiffuseColor = vec3(0.0, 0.0, 1.0);
        `
      }
    })
  })

  const material = useMemo(() => {
    const material = patchMaterial(
      new MeshStandardMaterial({
        color: "hotpink",
        metalness: 0.6,
        roughness: 0.5
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
