import { useControls } from "leva"
import {
  ComposableMaterial,
  Layer,
  LayerProps,
  Modules
} from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"

export const ColorLayer = (props: LayerProps) => {
  const controls = useControls("Color", {
    mix: { value: 1, min: 0, max: 1 },
    color: "#b10000"
  })

  const mix = useUniformUnit("float", controls.mix)
  const color = useUniformUnit("vec3", new Color(controls.color))

  return (
    <Layer mix={mix} {...props}>
      <Modules.Color color={color} />
    </Layer>
  )
}

export default function ColorExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <ColorLayer />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Fresnel</strong> module applies a fresnel (rim light) effect
        to the material.
      </Description>
    </group>
  )
}
