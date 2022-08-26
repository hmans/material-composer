import { useControls } from "leva"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { memo, useMemo } from "react"
import {
  Add,
  Input,
  Mul,
  Smoothstep,
  Sub,
  Time,
  VertexPosition
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { DoubleSide } from "three"

export default function MemoizationExample() {
  const controls = useControls("Layers", {
    mix: { value: 0, min: -1, max: 1 }
  })

  const mix = useUniformUnit("float", controls.mix)

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />
        <MyMaterial mix={mix} />
      </mesh>

      <Description>
        This example implements a material that feeds a couple of Shader
        Composer subtrees into module properties, which, on a re-render, would
        always make the material recompile its shader. To prevent this, the
        material is wrapped into its own <strong>memoized component</strong>.
      </Description>
    </group>
  )
}

const MyMaterial = memo(({ mix }: { mix: Input<"float"> }) => {
  const time = useMemo(() => Time(), [])

  return (
    <ComposableMaterial transparent side={DoubleSide}>
      <Modules.Plasma offset={Mul(time, -0.3)} />

      <Layer mix={Smoothstep(Sub(mix, 0.1), Add(mix, 0.1), VertexPosition.x)}>
        <Modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.3} />
        <Modules.Lava offset={Mul(time, 0.5)} scale={0.3} />
        <Modules.SetAlpha alpha={1} />
      </Layer>
    </ComposableMaterial>
  )
})
