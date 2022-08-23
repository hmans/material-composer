import { useControls } from "leva"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"

export default function Fresnel() {
  const controls = useControls({
    intensity: { value: 1, min: 0, max: 3 },
    power: { value: 4, min: 0, max: 8 }
  })

  const intensity = useUniformUnit("float", controls.intensity)
  const power = useUniformUnit("float", controls.power)

  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <Modules.Color color={new Color("#6a040f")} />
          <Modules.Fresnel intensity={intensity} power={power} />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Fresnel</strong> module applies a fresnel (rim light) effect
        to the material.
      </Description>
    </group>
  )
}
