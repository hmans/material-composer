import { useControls } from "leva"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { memo, ReactNode, useMemo } from "react"
import {
  Cos,
  Input,
  Mul,
  NormalizePlusMinusOne,
  Sin,
  Smoothstep,
  Step,
  Time,
  VertexPosition
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Color, DoubleSide, Vector3 } from "three"

const Memoize = ({ children }: { children?: ReactNode }) => {
  const r = useMemo(() => children, [])
  return <>{r}</>
}

export default function LayersExample() {
  const controls = useControls("Layers", {
    mix: { value: 0, min: -1, max: 1 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const time = useMemo(() => Time(), [])

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />
        <ComposableMaterial transparent side={DoubleSide}>
          <Memoize>
            <Modules.Plasma offset={Mul(time, -0.3)} />

            <Layer mix={Step(mix, VertexPosition.y)}>
              <Modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.3} />
              <Modules.Lava offset={Mul(time, 0.5)} scale={0.3} />
            </Layer>
          </Memoize>
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
