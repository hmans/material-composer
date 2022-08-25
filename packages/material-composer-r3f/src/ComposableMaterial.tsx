import { extend, useFrame, useThree } from "@react-three/fiber"
import { ComposableMaterial as ComposableMaterialImpl } from "material-composer"
import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { MeshStandardMaterial } from "three"
import { iCSMProps } from "three-custom-shader-material"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"
import { useVersion } from "@hmans/use-version"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type ComposableMaterialProps = Optional<iCSMProps, "baseMaterial">

extend({ ComposableMaterial: ComposableMaterialImpl })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      composableMaterial: ComposableMaterialProps
    }
  }
}

const Context = createContext<{ version: number; bumpVersion: () => void }>(
  null!
)

export const useComposedMaterialContext = () => useContext(Context)

export const ComposableMaterial = forwardRef<
  ComposableMaterialImpl,
  ComposableMaterialProps
>(({ children, baseMaterial = MeshStandardMaterial, ...props }, ref) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const renderer = useThree((s) => s.gl)

  const material = useRef<ComposableMaterialImpl>(null!)

  const [version, bumpVersion] = useVersion()

  const [modules, api] = provideModuleRegistration()

  /* Recompile on version change */
  useLayoutEffect(() => {
    material.current.compileModules(modules)
  }, [modules, version])

  /* Pass on the ref. */
  useImperativeHandle(ref, () => material.current)

  /* Run the material's per-frame tick. */
  useFrame((_, dt) => {
    material.current.tick(dt, camera, scene, renderer)
  })

  return (
    <composableMaterial
      attach="material"
      // @ts-ignore
      ref={material}
      baseMaterial={baseMaterial}
      {...props}
    >
      <Context.Provider value={{ version, bumpVersion }}>
        <ModuleRegistrationContext.Provider value={api}>
          {children}
        </ModuleRegistrationContext.Provider>
      </Context.Provider>
    </composableMaterial>
  )
})
