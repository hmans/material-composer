import { useControls } from "leva"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <ComposableMaterial>
          <Modules.Color color={new Color("hotpink")} />
          <Layer mix={mix}>
            <Modules.Color color={new Color("yellow")} />
          </Layer>
        </ComposableMaterial>
      </mesh>

      <Description>
        A simple example with a material that will fade back and forth between
        two colors.
      </Description>
    </group>
  )
}
