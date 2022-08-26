import { useRef } from "react"

export const useDetectShallowChange = (props: { [key: string]: any }) => {
  const version = useRef(0)
  const previousProps = useRef<any>()

  const changed =
    !previousProps.current ||
    Object.keys(props).length !== Object.keys(previousProps.current).length ||
    Object.keys(props).some((key) => {
      return !Object.is(previousProps.current[key], props[key])
    })

  previousProps.current = props

  return changed ? ++version.current : version
}
