import { ComponentMode } from "@/common/constants"
import { useEffect, useMemo } from "react"

const useOptions = ({ initialState, setFieldValue, values, mode }) => {
  useEffect(() => {
    if (mode === ComponentMode.CREATE) {
      setFieldValue('source.options', initialState)
      return () => {
        setFieldValue('source.options', null)
      }
    }
  }, [setFieldValue, initialState, mode])

  const options = useMemo(() => {
    if (values.source?.options) {
      return values.source.options
    }
    return initialState
  },
    [values.source.options, initialState]);

  return options
}

export default useOptions;