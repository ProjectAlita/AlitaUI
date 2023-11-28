import { Select } from "@mui/material";
import styled from '@emotion/styled';

const StyledSelect = styled(Select,
  {
    shouldForwardProp: prop => { 
      return  prop !== 'customSelectedColor' &&
      prop !== 'customSelectedFontSize' }
  })(({ customSelectedColor, customSelectedFontSize, theme }) => (`
  display: flex;
  height: 1.88rem;
  padding: 0.25rem 0rem;
  align-items: center;
  gap: 0.625rem;
  & .MuiOutlinedInput-notchedOutline {
    border-width: 0px;
  }
  & .Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 0px solid white;
  }
  & .MuiOutlinedInput-input {
    padding: 0.25rem 0 0.5rem;
  }
  & .MuiSelect-icon {
    right: 0px;
    font-size: 1rem;
  }
  & .MuiSelect-select {
    color: ${customSelectedColor || theme.palette.text.select.selected.primary};
    font-size: ${customSelectedFontSize || '1rem'};
  }
  fieldset{
    border: none !important;
    outline: none !important;
  };
`));
export default StyledSelect;