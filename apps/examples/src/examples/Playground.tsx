import {
  PatchedMaterialMaster,
  patchMaterial
} from "@material-composer/patch-material"
import { useMemo } from "react"
import { Lerp, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color, MeshStandardMaterial } from "three"
import { patched } from "./lib/patched"

export default function Playground() {
  const shader = useShader(() => {
    return PatchedMaterialMaster({
      diffuseColor: Lerp(
        new Color("red"),
        new Color("yellow"),
        NormalizePlusMinusOne(Sin(Time()))
      ),
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
      <mesh castShadow>
        <patched.MeshStandardMaterial color="red" {...shader} />
        <sphereGeometry />
      </mesh>
    </group>
  )
}
