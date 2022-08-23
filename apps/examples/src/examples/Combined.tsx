import { useControls } from "leva"
import {
  ComposableMaterial,
  Layer,
  LayerProps,
  Modules
} from "material-composer-r3f"
import { useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"
import { ColorLayer } from "./Color"
import { FresnelLayer } from "./Fresnel"

export const GradientLayer = (props: LayerProps) => {
  const controls = useControls("Gradient", {
    mix: { value: 1, min: 0, max: 1 },
    contrast: { value: 1, min: 0, max: 10 },
    colorA: "#fee440",
    colorB: "#00bbf9"
  })

  const mix = useUniformUnit("float", controls.mix)
  const contrast = useUniformUnit("float", controls.contrast)
  const colorA = useUniformUnit("vec3", new Color(controls.colorA))
  const colorB = useUniformUnit("vec3", new Color(controls.colorB))

  return (
    <Layer mix={mix} {...props}>
      <Modules.Gradient colorA={colorA} colorB={colorB} contrast={contrast} />
    </Layer>
  )
}

export default function Combined() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <ColorLayer />
          <GradientLayer />
          <FresnelLayer />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
