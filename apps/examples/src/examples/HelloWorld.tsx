import { useControls } from "leva"
import { Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { Mul, Time } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"
import { composed } from "@material-composer/patch-material"

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <composed.MeshStandardMaterial>
          <Modules.Color color={Mul(new Color("blue"), Time())} />
        </composed.MeshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
