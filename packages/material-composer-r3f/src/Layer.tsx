import { Layer as LayerImpl, LayerOptions } from "material-composer"
import React, { ReactNode, useMemo } from "react"
import { useComposedMaterialContext } from "./ComposableMaterial"
import {
  ModuleRegistrationContext,
  provideModuleRegistration,
  useModuleRegistration
} from "./moduleRegistration"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  const [modules, api] = provideModuleRegistration()
  const { version } = useComposedMaterialContext()

  /* Recreate the layer every time the props or modules change */
  const layer = useMemo(() => LayerImpl({ ...props, modules }), [
    props,
    modules
  ])

  /* Register it with the parent */
  useModuleRegistration(layer)

  return (
    <ModuleRegistrationContext.Provider value={api}>
      {children}
    </ModuleRegistrationContext.Provider>
  )
}
