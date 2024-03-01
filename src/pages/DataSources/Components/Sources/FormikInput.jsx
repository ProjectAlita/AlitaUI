import { StyledInput } from "@/pages/Prompts/Components/Common";
import { useFormikContext } from "formik";
import { useMemo } from "react";

/** Only use it inside formik form, otherwise useFormikContext won't work */
export default function FormikInput(props) {
  const { handleBlur, handleChange: handleFieldChange } = useFormikContext();

  const inputProps = useMemo(() => ({
    fullWidth: true,
    autoComplete: 'off',
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur
  }), [handleBlur, handleFieldChange])

  return (
    <StyledInput
      {...inputProps}
      {...props}
    />
  );
}