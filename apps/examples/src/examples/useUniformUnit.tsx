import { useMemo, useLayoutEffect } from "react"
import { GLSLType, JSTypes, UnitConfig, UniformUnit } from "shader-composer"

export const useUniformUnit = <T extends GLSLType>(
  type: T,
  value: JSTypes[T],
  config?: Partial<UnitConfig<T>>
) => {
  const uniform = useMemo(() => {
    console.log("useUniformUnit")
    return UniformUnit(type, value, config)
  }, [])

  useLayoutEffect(() => {
    uniform.value = value
  }, [uniform, value])

  return uniform
}
