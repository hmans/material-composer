import { Module, ModuleFactory, ModuleFactoryProps } from "material-composer"
import * as Modules from "material-composer/modules"
import { FC, useMemo } from "react"
import { useModuleRegistration } from "./moduleRegistration"

type Modules = typeof Modules

const cache = new Map<string, ModuleComponent<any>>()

type ModuleComponentProps<K extends keyof Modules> = Parameters<Modules[K]>[0]

type ModuleComponent<K extends keyof Modules> = FC<ModuleComponentProps<K>>

type ModuleComponentProxy = {
  [K in keyof Modules]: Modules[K] extends (...args: any[]) => Module
    ? ModuleComponent<K>
    : never
}

const makeModuleComponent = <P extends ModuleFactoryProps>(
  fac: ModuleFactory<P>
) => (props: P) => {
  const module = useMemo(() => fac(props), [props])
  useModuleRegistration(module)
  return null
}

export const ModuleReactor = new Proxy<ModuleComponentProxy>(
  {} as ModuleComponentProxy,
  {
    get<N extends keyof Modules>(target: any, name: N) {
      if (!cache.has(name)) {
        // @ts-ignore
        cache.set(name, makeModuleComponent(Modules[name]))
      }
      return cache.get(name)
    }
  }
)
