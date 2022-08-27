import { extend, useFrame, useThree } from "@react-three/fiber"
import { ComposableMaterial as ComposableMaterialImpl } from "material-composer"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { MeshStandardMaterial } from "three"
import { iCSMParams } from "three-custom-shader-material"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ComposableMaterialProps = Optional<iCSMParams, "baseMaterial"> & {
  children?: React.ReactNode
  attach?: string
}

extend({ ComposableMaterial: ComposableMaterialImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      composableMaterial: ComposableMaterialProps
    }
  }
}

export const ComposableMaterial = forwardRef<
  ComposableMaterialImpl,
  ComposableMaterialProps
>(({ children, baseMaterial = MeshStandardMaterial, ...props }, ref) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const renderer = useThree((s) => s.gl)

  const material = useRef<ComposableMaterialImpl>(null!)

  const modules = provideModuleRegistration()

  /* Recompile on version change */
  useLayoutEffect(() => {
    material.current.compileModules(modules.list)
  }, [modules.version])

  /* Pass on the ref. */
  useImperativeHandle(ref, () => material.current)

  /* Run the material's per-frame tick. */
  useFrame((_, dt) => {
    material.current.tick(dt, camera, scene, renderer)
  })

  return (
    <composableMaterial
      // @ts-ignore
      ref={material}
      args={[{ baseMaterial, ...props }]}
      {...props}
    >
      <ModuleRegistrationContext.Provider value={modules}>
        {children}
      </ModuleRegistrationContext.Provider>
    </composableMaterial>
  )
})
