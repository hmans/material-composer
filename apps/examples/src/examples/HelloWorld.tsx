import { useControls } from "leva"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { Mul, Sin, Time } from "shader-composer"
import { Color } from "three"
import { useUniformUnit } from "./useUniformUnit"

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <ComposableMaterial>
          {/* Using a SC expression will be a new prop every render */}
          {/* <Modules.Color color={Mul(new Color("white"), Sin(Time()))} /> */}

          <Modules.Color color="red" />

          <Layer mix={mix}>
            <Modules.Color color="green" />
          </Layer>
        </ComposableMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
