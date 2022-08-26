import { Module, ModuleFactory, ModuleFactoryProps } from "material-composer"
import * as Modules from "material-composer/modules"
import React, { FC, useMemo } from "react"
import { Input } from "shader-composer"
import { useModuleRegistration } from "./moduleRegistration"
import { useDetectShallowChange } from "./lib/useDetectShallowChange"
import { Layer, LayerProps } from "./Layer"

type Modules = typeof Modules

const cache = new Map<string, ModuleComponent<any>>()

type ModuleComponentProps<K extends keyof Modules> = Parameters<
  Modules[K]
>[0] & { blend?: Input<"float"> }

type ModuleComponent<K extends keyof Modules> = FC<ModuleComponentProps<K>>

type ModuleComponentProxy = {
  [K in keyof Modules]: Modules[K] extends (...args: any[]) => Module
    ? ModuleComponent<K>
    : never
}

const enableBlend = <P extends {}>(Component: FC<P>) => ({
  blend,
  ...props
}: P & LayerProps) =>
  blend ? (
    <Layer blend={blend}>
      <Component {...(props as P)} />
    </Layer>
  ) : (
    <Component {...(props as P)} />
  )

export const makeModuleComponent = <P extends ModuleFactoryProps>(
  fac: ModuleFactory<P>
) => (props: P) => {
  const module = useMemo(() => {
    return fac(props)
  }, [useDetectShallowChange(props)])

  useModuleRegistration(module)

  return null
}

export const ModuleReactor = new Proxy<ModuleComponentProxy>(
  {} as ModuleComponentProxy,
  {
    get<N extends keyof Modules>(target: any, name: N) {
      if (!cache.has(name)) {
        // @ts-ignore
        cache.set(name, enableBlend(makeModuleComponent(Modules[name])))
      }
      return cache.get(name)
    }
  }
)
