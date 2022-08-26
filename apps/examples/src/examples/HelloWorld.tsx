import { useControls } from "leva"
import { ComposableMaterial, Modules } from "material-composer-r3f"
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
          <Modules.Gradient
            stops={[
              [new Color("white"), 0],
              [new Color("hotpink"), 1]
            ]}
          />
        </ComposableMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
