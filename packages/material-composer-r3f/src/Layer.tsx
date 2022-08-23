import { Layer as LayerImpl, LayerOptions } from "material-composer"
import React, { ReactNode, useMemo } from "react"
import {
  ModuleRegistrationContext,
  provideModuleRegistration,
  useModuleRegistration
} from "./moduleRegistration"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  const [modules, api] = provideModuleRegistration()

  /* Recreate the layer every time the props or modules change */
  const layer = useMemo(() => LayerImpl({ ...props, modules }), [
    ...Object.values(props),
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
