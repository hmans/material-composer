import { ModuleFactory } from "material-composer"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { makeModuleComponent } from "material-composer-r3f/src/reactor"
import {
  Clamp,
  Lerp,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  Remap,
  Smoothstep,
  VertexPosition
} from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color } from "three"

const RustImpl: ModuleFactory = ({}) => (state) => {
  const rust = Smoothstep(0, 0.3, PSRDNoise3D(Mul(VertexPosition, 1.3)))
  const rust2 = NormalizePlusMinusOne(PSRDNoise3D(Mul(VertexPosition, 38)))

  return {
    ...state,
    color: Lerp(state.color, new Color("#370617"), Clamp(rust, 0, 0.8)),
    metalness: Lerp(state.metalness, 1, OneMinus(rust)),
    roughness: Lerp(state.roughness, 1, Mul(Remap(rust, 0, 1, 0, 1), rust2))
  }
}

const Rust = makeModuleComponent(RustImpl)

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry />
        <ComposableMaterial metalness={0.7} roughness={0.3}>
          <Modules.Color color={new Color("#495057")} />
          <Rust />
        </ComposableMaterial>
      </mesh>
    </group>
  )
}
