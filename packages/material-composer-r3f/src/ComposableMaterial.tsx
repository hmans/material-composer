import { useVersion } from "@hmans/use-version"
import { extend, useFrame, useThree } from "@react-three/fiber"
import {
  ComposableMaterial as ComposableMaterialImpl,
  Module
} from "material-composer"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { MeshStandardMaterial } from "three"
import { iCSMProps } from "three-custom-shader-material"

const ModulePipeContext = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useMaterialContext = () => useContext(ModulePipeContext)

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

export const ComposableMaterial = forwardRef<
  ComposableMaterialImpl,
  ComposableMaterialProps
>(({ children, baseMaterial = MeshStandardMaterial, ...props }, ref) => {
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const renderer = useThree((s) => s.gl)

  const material = useRef<ComposableMaterialImpl>(null!)
  const [version, bumpVersion] = useVersion()

  /* Recompile on version change */
  useEffect(() => {
    material.current.compileModules()
  }, [version])

  const addModule = useCallback((module: Module) => {
    if (!material.current) return
    material.current.modules = [...material.current.modules, module]
    bumpVersion()
  }, [])

  const removeModule = useCallback((module: Module) => {
    if (!material.current) return
    material.current.modules = material.current.modules.filter(
      (m) => m !== module
    )
    bumpVersion()
  }, [])

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
      <ModulePipeContext.Provider value={{ addModule, removeModule }}>
        {children}
      </ModulePipeContext.Provider>
    </composableMaterial>
  )
})
