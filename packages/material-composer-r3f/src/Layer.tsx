import { LayerOptions, Module } from "material-composer"
import React, { createContext, ReactNode, useCallback, useState } from "react"
import { useConst } from "@hmans/use-const"
import { useVersion } from "@hmans/use-version"

export type LayerProps = LayerOptions & { children?: ReactNode }

export const Layer = ({ children, ...props }: LayerProps) => {
  return <>{children}</>
}
