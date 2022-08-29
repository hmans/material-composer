import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { flow } from "fp-ts/function"
import { compileShader } from "shader-composer"
import { initialModuleState, Module } from "."

export const compileModules = (modules: Module[]) => {
  /* Transform state with given modules. */
  const { color, ...state } = flow(...(modules as [Module]))(
    initialModuleState()
  )

  /* Construct a shader master unit */
  const root = PatchedMaterialMaster({
    ...state,
    diffuseColor: color
  })

  /* And finally compile a shader from the state. */
  return compileShader(root)
}
