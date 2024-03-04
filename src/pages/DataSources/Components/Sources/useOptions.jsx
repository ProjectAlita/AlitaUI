import { ComponentMode } from "@/common/constants"
import { useFormikContext } from "formik";
import { useEffect, useMemo } from "react"

const useOptions = ({ initialState, mode }) => {
  const { values, setFieldValue } = useFormikContext();
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
  }, [values.source.options, initialState]);

  return options
}

export default useOptions;