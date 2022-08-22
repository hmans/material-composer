import { Input, pipe } from "shader-composer"

export * from "./ComposableMaterial"

/**
 * ModuleState describes the state going into a module (and returned by it.)
 * Modules are encouraged to change the values they're interested in, but can
 * also just pass through others without changing them.
 */
export type ModuleState = {
  position: Input<"vec3">
  normal: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
}

/**
 * A Module is a function that accepts a module state as its input and returns a new module state.
 */
export type Module = (state: ModuleState) => ModuleState

/**
 * A Module Factory is a function that returns a Module.
 */
export type ModuleFactory<P extends ModuleFactoryProps = {}> = (
  props: P
) => Module

export type ModuleFactoryProps = Record<string, any>

/**
 * A Module Pipe is an array of Modules.
 */
export type ModulePipe = Module[]

export const pipeModules = (initial: ModuleState, ...modules: Module[]) =>
  pipe(initial, ...(modules as [Module]))
