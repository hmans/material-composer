import { DependencyList, useLayoutEffect, useMemo } from "react"

export const useManagedInstance = <T extends any>(
  factory: () => T,
  deps: DependencyList = []
) => {
  const instance = useMemo(() => factory(), deps)
  useLayoutEffect(() => () => (instance as any).dispose?.(), [instance])
  return instance
}
