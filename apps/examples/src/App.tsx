import {
  Application,
  Description,
  Example,
  FlatStage,
  Heading
} from "r3f-stage"
import "r3f-stage/styles.css"
import Combined from "./examples/CombinedModules"
import FireballExample from "./examples/Fireball"
import HelloWorld from "./examples/HelloWorld"
import MemoizationExample from "./examples/Memoization"
import PlasmaBallExample from "./examples/PlasmaBall"
import Playground from "./examples/Playground"
import Vanilla from "./examples/Vanilla"

export default () => (
  <Application>
    <FlatStage>
      <Heading>The Basics</Heading>

      <Example path="hello-world" title="Hello World" makeDefault>
        <HelloWorld />
      </Example>

      <Example path="vanilla" title="Vanilla Three.js">
        <Vanilla />
      </Example>

      <Example path="modules" title="Modules!" makeDefault>
        <Combined />
      </Example>

      <Heading>Animations</Heading>

      <Example path="fireball" title="Fireball">
        <FireballExample />

        <Description>
          An animated fireball! This example uses a normal mesh together with
          VFXMaterial.
        </Description>
      </Example>

      <Example path="plasmaball" title="Plasma Ball">
        <PlasmaBallExample />
      </Example>

      <Heading>Advanced</Heading>

      <Example path="memoization" title="Memoization">
        <MemoizationExample />
      </Example>

      <Heading>Experiments</Heading>

      <Example path="playground" title="Playground">
        <Playground />
      </Example>
    </FlatStage>
  </Application>
)
