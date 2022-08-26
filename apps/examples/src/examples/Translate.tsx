import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { Mul, Sin, Time } from "shader-composer"
import { Vector3 } from "three"

export default function Translate() {
  const time = useMemo(() => Time(), [])

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <ComposableMaterial>
          <Modules.Translate offset={Mul(new Vector3(1, 0, 0), Sin(time))} />
        </ComposableMaterial>
      </mesh>

      <Description>
        The <strong>Translate</strong> module translates (moves) vertices by a
        given offset.
      </Description>
    </group>
  )
}
