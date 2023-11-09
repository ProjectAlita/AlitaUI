import { FormControl, MenuItem, Select } from "@mui/material";
import { useCallback, useState } from "react";

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: 120,
  margin: '0 0.5rem',
  verticalAlign: 'bottom',
  '& .MuiInputBase-root.MuiInput-root:before': {
    border: 'none'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none'
    }
  }
}));

export default function SingleSelect ({label, options, onValueChange}) {
  const [value, setValue] = useState('');
  const handleChange = useCallback((event) => {
    setValue(event.target.value);
    onValueChange(event.target.value);
  }, [onValueChange]);

  return (
    <StyledFormControl variant="standard" size="small" hiddenLabel={true}>
      <Select
        labelId="simple-select-label"
        id="simple-select"
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
          ))
        }
      </Select>
    </StyledFormControl>
  );
}