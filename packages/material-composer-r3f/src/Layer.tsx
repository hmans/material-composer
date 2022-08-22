import { LayerOptions } from "material-composer"
import React, { ReactNode } from "react"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  return <>{children}</>
}
