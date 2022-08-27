import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { useControls } from "leva"
import { Lerp, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color } from "three"
import { patched } from "./lib/patched"

export default function Playground() {
  useControls({ foo: { value: 1, min: 0, max: 2 } })

  const shader = useShader(() => {
    return PatchedMaterialMaster({
      diffuseColor: Lerp(
        new Color("white"),
        new Color("blue"),
        NormalizePlusMinusOne(Sin(Time()))
      ),
      metalness: 0.5,
      roughness: 0.5
    })
  }, [])

  return (
    <group position-y={1.5}>
      <mesh castShadow>
        <patched.MeshStandardMaterial color="yellow" {...shader} />

        {/* <patched.MaterialInstance
          instance={new MeshStandardMaterial()}
          {...shader}
        /> */}
        <sphereGeometry />
      </mesh>
    </group>
  )
}
