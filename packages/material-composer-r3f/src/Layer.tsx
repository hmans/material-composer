import { Layer as LayerImpl, LayerOptions } from "material-composer"
import React, { ReactNode, useMemo } from "react"
import {
  ModuleRegistrationContext,
  provideModuleRegistration,
  useModuleRegistration
} from "./moduleRegistration"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  const modules = provideModuleRegistration()

  /* Recreate the layer every time the props or modules change */
  const layer = useMemo(() => {
    return LayerImpl({ ...props, modules: modules.list })
  }, [...Object.values(props)])

  /* Register it with the parent */
  useModuleRegistration(layer)

  return (
    <ModuleRegistrationContext.Provider value={modules}>
      {children}
    </ModuleRegistrationContext.Provider>
  )
}
