import { $, Add, Input, pipe, Vec3 } from "shader-composer"
import { ModuleFactory } from ".."

type TranslateProps = {
  offset: Input<"vec3">
}

export const Translate: ModuleFactory<TranslateProps> = ({ offset }) => (
  state
) => ({
  ...state,
  position: pipe(
    offset,

    /* FIXME: ugh, figure out something nicer to allow the user to configure which space to translate in! */
    (v) =>
      Vec3($`
      ${v}
      #ifdef USE_INSTANCING
      * mat3(instanceMatrix)
      #endif
      `),
    (v) => Add(state.position, v)
  )
})
