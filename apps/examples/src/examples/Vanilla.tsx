import { useThree } from "@react-three/fiber"
import { ComposableMaterial } from "material-composer"
import * as Modules from "material-composer/modules"
import { Description } from "r3f-stage"
import { useEffect, useRef } from "react"
import { Time } from "shader-composer"
import {
  Color,
  Group,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three"
import { loop } from "./lib/loop"

const vanillaCode = (
  parent: Object3D,
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer
) => {
  /* Create a Lifetime module. */
  const time = Time()

  const modules = [Modules.SetColor({ color: new Color("hotpink") })]

  const material = new ComposableMaterial({ modules })
  material.compileModules()

  const sphere = new Mesh(new SphereGeometry(), material)
  parent.add(sphere)

  /* Create mesh and add it to the scene. */
  const stopLoop = loop((dt) => {
    material.tick(dt, camera, scene, renderer)
  })

  return () => {
    stopLoop()

    parent.remove(sphere)
    sphere.geometry.dispose()
    material.dispose()
  }
}

export default function Vanilla() {
  const group = useRef<Group>(null!)
  const { camera, scene, gl } = useThree()
  useEffect(
    () => vanillaCode(group.current, camera as PerspectiveCamera, scene, gl),
    []
  )
  return (
    <group ref={group}>
      <Description>
        An example of how to use Material Composer with vanilla Three.js.
      </Description>
    </group>
  )
}
