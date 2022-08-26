import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Color, MeshPhysicalMaterial } from "three"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial baseMaterial={MeshPhysicalMaterial}>
          <Modules.Color color={new Color("red")} />
          <Modules.Color color={new Color("green")} />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
