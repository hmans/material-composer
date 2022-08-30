import { useControls } from "leva"
import { composable, Layer, modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useUniformUnit } from "shader-composer-r3f"
import textureUrl from "./textures/hexgrid.jpeg"
import { useTexture } from "@react-three/drei"

export default function Textures() {
  const controls = useControls({ mix: { value: 0.5, min: 0, max: 1 } })
  const mix = useUniformUnit("float", controls.mix)
  const texture = useTexture(textureUrl)

  return (
    <group>
      <mesh position-y={1.5} castShadow>
        <sphereGeometry args={[1, 64, 64]} />

        <composable.MeshStandardMaterial
          map={texture}
          color="hotpink"
        ></composable.MeshStandardMaterial>
      </mesh>

      <Description>
        A simple example with a material that can blend between two colors,
        steered by a uniform value.
      </Description>
    </group>
  )
}
