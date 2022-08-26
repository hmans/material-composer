import { useThree } from "@react-three/fiber"
import { ComposableMaterial, Layer } from "material-composer"
import * as Modules from "material-composer/modules"
import { Description } from "r3f-stage"
import { useEffect, useRef } from "react"
import { Mul, NormalizePlusMinusOne, Sin, Time } from "shader-composer"
import {
  DoubleSide,
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
  const time = Time()

  const modules = [
    Modules.Color({ color: "hotpink" }),
    Layer({ mix: 0.5, modules: [Modules.Fresnel({})] }),
    Modules.Color({ color: "green" })
  ]

  const material = new ComposableMaterial({
    modules,
    transparent: true,
    side: DoubleSide
  })

  const sphere = new Mesh(new SphereGeometry(), material)
  sphere.position.y = 1.5
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
