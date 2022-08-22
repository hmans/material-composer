import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { Mix, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import { Color } from "three"

export default function HelloWorld() {
  return (
    <group>
      <mesh position-y={1.5}>
        <sphereGeometry />

        <ComposableMaterial>
          <Modules.SetColor
            color={Mix(
              new Color("hotpink"),
              new Color("yellow"),
              NormalizePlusMinusOne(Sin(Time()))
            )}
          />
        </ComposableMaterial>
      </mesh>

      <Description>
        A simple example with a material that will fade back and forth between
        through colors.
      </Description>
    </group>
  )
}
