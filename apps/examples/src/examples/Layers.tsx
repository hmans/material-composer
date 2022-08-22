import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Time } from "shader-composer"
import { Color, DoubleSide, MeshStandardMaterial } from "three"

export default function LayersExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial
          baseMaterial={MeshStandardMaterial}
          transparent
          side={DoubleSide}
        >
          <Modules.SetColor color={new Color("hotpink")} />

          <Layer mix={1}>
            <Modules.SetColor color={new Color("yellow")} />
          </Layer>
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
