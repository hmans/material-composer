import { patched } from "@material-composer/patched"
import { compileModules, Module } from "material-composer"
import React, {
  DependencyList,
  FunctionComponent,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { Unit } from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Material, RGBADepthPacking } from "three"
import {
  ModuleRegistrationContext,
  provideModuleRegistration
} from "./moduleRegistration"

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

type Patched = typeof patched

export type Composable = {
  [K in keyof Patched]: Patched[K] extends FunctionComponent<infer P>
    ? FunctionComponent<P & { autoShadow?: boolean }>
    : never
}

export const composable = new Proxy<Composable>(patched, {
  get: (target, key) => {
    if (!hasKey(target, key)) return

    const Component = target[key]

    return ({ children, autoShadow = false, ...props }: any) => {
      const material = useRef<any>()
      const modules = provideModuleRegistration()

      /* Compile modules into a shader graph */
      const root = useMemo(() => {
        return compileModules(modules.list)
      }, [modules.version])

      /* Return shader compiled from graph */
      const shader = useShader(() => root, [root])

      /* Register shader root for this material */
      useLayoutEffect(() => {
        materialShaderRoots.set(material.current, root)
        return () => void materialShaderRoots.delete(material.current)
      }, [root])

      return (
        <>
          <Component ref={material} {...props} {...shader}>
            <ModuleRegistrationContext.Provider value={modules}>
              {children}
            </ModuleRegistrationContext.Provider>
          </Component>

          {autoShadow && (
            <composable.MeshDepthMaterial
              attach="customDepthMaterial"
              depthPacking={RGBADepthPacking}
            >
              {children}
            </composable.MeshDepthMaterial>
          )}
        </>
      )
    }
  }
})

const materialShaderRoots = new Map<Material, Unit>()

/**
 * A somewhat experimental, possibly temporary API to retrieve the Shader Composer
 * shader graph for a given material. This allows interested parties (like VFX
 * Composer's Particles class) to inspect the shader graph that was compiled for
 * the given material.
 *
 * @param material A Material instance
 * @returns The root unit of the Shader Composer graph for the given material
 */
export const getShaderRootForMaterial = (material: Material) =>
  materialShaderRoots.get(material)
