import { StyledInput } from "@/pages/Prompts/Components/Common";
import { useFormikContext } from "formik";
import { useMemo } from "react";

/** Only use it inside formik form, otherwise useFormikContext won't work */
export default function FormikInput({value, ...props}) {
  const { errors, handleBlur, handleChange: handleFieldChange } = useFormikContext();

  const inputProps = useMemo(() => ({
    fullWidth: true,
    autoComplete: 'off',
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur,
    error: errors[props.name],
    helperText: errors[props.name]
  }), [errors, handleBlur, handleFieldChange, props.name])

  return (
    <StyledInput
      {...inputProps}
      {...props}
      value={value ?? ''}
    />
  );
}