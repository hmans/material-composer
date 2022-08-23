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
    mix: { value: 0.5, min: 0, max: 1 },
    contrast: { value: 1, min: 0, max: 10 },
    colorA: "#00bbf9",
    stopA: { value: 0, min: 0, max: 1 },
    colorB: "#9d0208",
    stopB: { value: 0.5, min: 0, max: 1 },
    colorC: "#fee440",
    stopC: { value: 1, min: 0, max: 1 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const contrast = useUniformUnit("float", controls.contrast)
  const colorA = useUniformUnit("vec3", new Color(controls.colorA))
  const stopA = useUniformUnit("float", controls.stopA)
  const colorB = useUniformUnit("vec3", new Color(controls.colorB))
  const stopB = useUniformUnit("float", controls.stopB)
  const colorC = useUniformUnit("vec3", new Color(controls.colorC))
  const stopC = useUniformUnit("float", controls.stopC)

  return (
    <Layer mix={mix} {...props}>
      <Modules.Gradient
        stops={[
          [colorA, stopA],
          [colorB, stopB],
          [colorC, stopC]
        ]}
        contrast={contrast}
      />
    </Layer>
  )
}

export default function Combined() {
  return (
    <group position-y={1.5}>
      <mesh castShadow>
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
