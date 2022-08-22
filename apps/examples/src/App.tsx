import {
  Application,
  Description,
  Example,
  FlatStage,
  Heading
} from "r3f-stage"
import "r3f-stage/styles.css"
import FireballExample from "./examples/Fireball"
import PlasmaBallExample from "./examples/PlasmaBall"
import Playground from "./examples/Playground"

export default () => (
  <Application>
    <FlatStage>
      <Heading>Animations</Heading>

      <Example path="fireball" title="Fireball" makeDefault>
        <FireballExample />

        <Description>
          An animated fireball! This example uses a normal mesh together with
          VFXMaterial.
        </Description>
      </Example>

      <Example path="plasmaball" title="Plasma Ball">
        <PlasmaBallExample />
      </Example>

      <Heading>Experiments</Heading>
      <Example path="playground" title="Playground">
        <Playground />
      </Example>
    </FlatStage>
  </Application>
)
