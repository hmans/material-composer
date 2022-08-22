import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { Mul, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import { DoubleSide } from "three"

export default function LayersExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial transparent side={DoubleSide}>
          <Layer>
            <Modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />
            <Modules.Lava offset={Mul(time, 0.5)} scale={0.3} />
          </Layer>

          <Layer mix={NormalizePlusMinusOne(Sin(time))}>
            <Modules.DistortSurface offset={Mul(time, -0.5)} amplitude={0.8} />
            <Modules.Plasma offset={Mul(time, -0.3)} />
          </Layer>
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
