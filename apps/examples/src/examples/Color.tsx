import { useControls } from "leva"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"

export default function ColorExample() {
  const controls = useControls({
    color: "#e9edc9"
  })

  const color = useUniformUnit("vec3", new Color(controls.color))

  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <Modules.Color color={color} />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Fresnel</strong> module applies a fresnel (rim light) effect
        to the material.
      </Description>
    </group>
  )
}
