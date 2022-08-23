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

export const FresnelLayer = (props: LayerProps) => {
  const controls = useControls("Fresnel", {
    mix: { value: 0.5, min: 0, max: 1 },
    intensity: { value: 5, min: 0, max: 10 },
    power: { value: 4, min: 0, max: 8 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const intensity = useUniformUnit("float", controls.intensity)
  const power = useUniformUnit("float", controls.power)

  return (
    <Layer mix={mix} {...props}>
      <Modules.Fresnel intensity={intensity} power={power} />
    </Layer>
  )
}

export default function Fresnel() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <Modules.Color color={new Color("#6a040f")} />
          <FresnelLayer />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Fresnel</strong> module applies a fresnel (rim light) effect
        to the material.
      </Description>
    </group>
  )
}
