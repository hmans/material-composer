import { useControls } from "leva"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { Sin, Time } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"

export default function HelloWorld() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <ComposableMaterial>
          <Modules.Color color="blue" />

          <Modules.Color color="green" blend={mix} />

          <Layer blend={0.2}>
            <Modules.Fresnel />
            <Modules.Color color="hotpink" blend={Sin(Time())} />
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
