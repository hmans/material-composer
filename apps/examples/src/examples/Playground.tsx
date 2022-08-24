import { useTexture } from "@react-three/drei"
import { ModuleFactory } from "material-composer"
import { ComposableMaterial, Layer, Modules } from "material-composer-r3f"
import { makeModuleComponent } from "material-composer-r3f/src/reactor"
import { Smoothstep, VertexPosition } from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color, TangentSpaceNormalMap } from "three"
import rustNormalTextureUrl from "./textures/rust-normal.jpeg"

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
  const rustNormalMap = useTexture(rustNormalTextureUrl)

  return (
    <group position-y={1.5}>
      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial
          metalness={1}
          roughness={0.3}
          normalMap={rustNormalMap}
          normalMapType={TangentSpaceNormalMap}
        >
          <Modules.Color color={new Color("#495057")} />

          <Layer mix={Smoothstep(-0.1, 0.4, PSRDNoise3D(VertexPosition))}>
            <Rust />
          </Layer>

          <Modules.Fresnel />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
