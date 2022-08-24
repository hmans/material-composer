import { useControls } from "leva"
import {
  ComposableMaterial,
  ComposableMaterialProps,
  Layer,
  Modules
} from "material-composer-r3f"
import { DependencyList, ReactNode, useMemo } from "react"
import {
  Add,
  Mul,
  Smoothstep,
  Step,
  Sub,
  Time,
  VertexPosition
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { DoubleSide } from "three"

const Memoize = ({
  children,
  deps = []
}: {
  children?: ReactNode
  deps?: DependencyList
}) => {
  const r = useMemo(() => children, deps)
  return <>{r}</>
}

const MemoizedComposableMaterial = (props: ComposableMaterialProps) => (
  <Memoize>
    <ComposableMaterial {...props} />
  </Memoize>
)

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
        <MemoizedComposableMaterial transparent side={DoubleSide}>
          <Modules.Plasma offset={Mul(time, -0.3)} />

          <Layer
            mix={Smoothstep(Sub(mix, 0.1), Add(mix, 0.1), VertexPosition.x)}
          >
            <Modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.3} />
            <Modules.Lava offset={Mul(time, 0.5)} scale={0.3} />
          </Layer>
        </MemoizedComposableMaterial>
      </mesh>
    </group>
  )
}
