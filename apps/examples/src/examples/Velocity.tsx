import { composable, modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { Time } from "shader-composer"
import { Vector3 } from "three"

export default function Velocity() {
  const time = useMemo(() => Time(), [])

  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <composable.MeshStandardMaterial>
          <modules.Velocity velocity={new Vector3(0.15, 0, 0)} time={time} />
        </composable.MeshStandardMaterial>
      </mesh>

      <Description>
        The <strong>Velocity</strong> module implements stateless velocity
        animation, translating vertices by a given velocity vector multiplied by
        the time. Useful for particles!
      </Description>
    </group>
  )
}
