import { ComposableMaterial } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { ColorLayer } from "./Color"
import { FresnelLayer } from "./Fresnel"

export default function Combined() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <ComposableMaterial>
          <ColorLayer />
          <FresnelLayer />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Fresnel</strong> module applies a fresnel (rim light) effect
        to the material.
      </Description>
    </group>
  )
}
