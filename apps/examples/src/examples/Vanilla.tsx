import {
  PatchedMaterialMaster,
  patchMaterial
} from "@material-composer/patch-material"
import { useThree } from "@react-three/fiber"
import {
  initialModuleState,
  Layer,
  ModulePipe,
  pipeModules
} from "material-composer"
import * as Modules from "material-composer/modules"
import { Description } from "r3f-stage"
import { useEffect, useRef } from "react"
import {
  compileShader,
  Mul,
  NormalizePlusMinusOne,
  Sin,
  Time
} from "shader-composer"
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three"
import { loop } from "./lib/loop"

export const compileModules = (modules: ModulePipe) => {
  /* Transform state with given modules. */
  const { color, ...state } = pipeModules(
    initialModuleState(),
    ...(modules || [])
  )

  /* Construct a shader master unit */
  const root = PatchedMaterialMaster({
    ...state,
    diffuseColor: color
  })

  /* And finally compile a shader from the state. */
  return compileShader(root)
}

const vanillaCode = (
  parent: Object3D,
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer
) => {
  const time = Time()

  const modules = [
    Layer({
      modules: [Modules.Plasma({ offset: Mul(time, -0.2) })]
    }),

    Layer({
      opacity: NormalizePlusMinusOne(Sin(time)),
      modules: [
        Modules.DistortSurface({ offset: Mul(time, 0.4), amplitude: 0.3 }),
        Modules.Lava({ offset: Mul(time, 0.2) }),
        Modules.Alpha({ alpha: 1 })
      ]
    })
  ]

  const material = new MeshStandardMaterial({
    transparent: true,
    side: DoubleSide
  })

  const [shader, shaderMeta] = compileModules(modules)
  patchMaterial(material, shader)

  const sphere = new Mesh(new SphereGeometry(), material)
  sphere.position.y = 1.5
  parent.add(sphere)

  /* Create mesh and add it to the scene. */
  const stopLoop = loop((dt) => {
    shaderMeta.update(dt, camera, scene, renderer)
  })

  return () => {
    stopLoop()

    parent.remove(sphere)
    sphere.geometry.dispose()
    material.dispose()
    shaderMeta.dispose()
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
