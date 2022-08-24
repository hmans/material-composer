import { ModuleFactory } from "material-composer"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { makeModuleComponent } from "material-composer-r3f/src/reactor"
import { Lerp, Smoothstep, VertexPosition } from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color, MeshPhysicalMaterial } from "three"

const RustImpl: ModuleFactory = ({}) => (state) => {
  return {
    ...state,
    color: new Color("#370617"),
    metalness: 0.2,
    roughness: 0.8
  }
}

const Rust = makeModuleComponent(RustImpl)

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial metalness={1} roughness={0.3}>
          <Modules.Color color={new Color("#495057")} />

          <Layer mix={Smoothstep(-0.1, 0.4, PSRDNoise3D(VertexPosition))}>
            <Rust />
          </Layer>
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
