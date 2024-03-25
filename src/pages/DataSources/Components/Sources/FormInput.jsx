import StyledInputEnhancer from "@/components/StyledInputEnhancer";
import { StyledInput } from "@/pages/Prompts/Components/Common";
import { useMemo } from "react";

export default function FormInput({ value, inputEnhancer, ...props }) {

  const inputProps = useMemo(() => ({
    fullWidth: true,
    autoComplete: 'off',
    variant: 'standard',
  }), [])

  return (
    inputEnhancer ?
      <StyledInputEnhancer
        {...inputProps}
        {...props}
        value={value ?? ''}
      /> :
      <StyledInput
        {...inputProps}
        {...props}
        value={value ?? ''}
      />
  );
}