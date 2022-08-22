import { LayerOptions, Module } from "material-composer"
import React, { ReactNode, useLayoutEffect, useMemo, useState } from "react"
import {
  ModuleRegistrationContext,
  provideModuleRegistration,
  useModuleRegistration
} from "./moduleRegistration"
import { Layer as LayerImpl } from "material-composer"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  const [modules, api] = provideModuleRegistration()

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
