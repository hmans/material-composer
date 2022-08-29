import { ModuleFactory } from "material-composer"
import { composable, modules } from "material-composer-r3f"
import { moduleComponent } from "material-composer-r3f/src/reactor"
import { Heat, HeatOptions } from "material-composer/units"
import { Description } from "r3f-stage"
import { Gradient, Mul, Time, vec3 } from "shader-composer"
import * as THREE from "three"

export type LavaProps = HeatOptions

export const LavaModule: ModuleFactory<LavaProps> = (props) => (state) => ({
  ...state,
  color: Gradient(
    Heat(state.position, props),
    [new THREE.Color("#03071E"), 0],
    [new THREE.Color("#03071E"), 0.1],
    [new THREE.Color("#DC2F02"), 0.5],
    [new THREE.Color("#E85D04"), 0.6],
    [new THREE.Color("#FFBA08").multiplyScalar(2), 0.65],
    [new THREE.Color("white").multiplyScalar(2), 0.97],
    [new THREE.Color("white").multiplyScalar(2), 0.99],
    [new THREE.Color("white").multiplyScalar(2), 1]
  )
})

export const Lava = moduleComponent(LavaModule)

export default function FireballExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <composable.MeshStandardMaterial autoShadow>
          <modules.DistortSurface offset={Mul(time, 0.4)} amplitude={0.1} />

          <Lava
            offset={Mul(vec3(0.1, 0.2, 0.5), time)}
            scale={0.3}
            octaves={5}
            power={1}
          />
        </composable.MeshStandardMaterial>
      </mesh>

      <Description>
        Example combining the <strong>DistortSurface</strong> module with a
        custom module implementing a lava effect. The mesh also uses a
        <strong>custom depth material</strong> to allow shadows to follow the
        surface distortion.
      </Description>
    </group>
  )
}
