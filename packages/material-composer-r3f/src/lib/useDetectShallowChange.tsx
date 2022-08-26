import { useLayoutEffect, useRef } from "react"

export const useDetectShallowChange = (props: { [key: string]: any }) => {
  const previousProps = useRef<any>()

  const changed =
    /* If we don't have a previous state, we have a change! */
    !previousProps.current ||
    /* If the number of props has changed, we have a change! */
    Object.keys(props).length !== Object.keys(previousProps.current).length ||
    /* If any of the props have changed, we have a change! */
    Object.keys(props).some((key) => {
      return !Object.is(previousProps.current[key], props[key])
    })

  /* Remember the props for the next render. */
  useLayoutEffect(() => {
    previousProps.current = props
  })

  return changed ? Math.random() : -1
}
