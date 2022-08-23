import {
  Application,
  Description,
  Example,
  FlatStage,
  Heading
} from "r3f-stage"
import "r3f-stage/styles.css"
import ColorExample from "./examples/Color"
import Combined from "./examples/Combined"
import FireballExample from "./examples/Fireball"
import Fresnel from "./examples/Fresnel"
import HelloWorld from "./examples/HelloWorld"
import LayersExample from "./examples/Layers"
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

      <Example path="layers" title="Layers">
        <LayersExample />
      </Example>

      <Heading>Modules</Heading>

      <Example path="modules/color" title="Color" makeDefault>
        <ColorExample />
      </Example>

      <Example path="modules/fresnel" title="Fresnel" makeDefault>
        <Fresnel />
      </Example>

      <Example path="modules/combined" title="Combined" makeDefault>
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

      <Heading>Experiments</Heading>

      <Example path="playground" title="Playground">
        <Playground />
      </Example>
    </FlatStage>
  </Application>
)
