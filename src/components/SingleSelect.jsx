import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback } from "react";

const StyledFormControl = styled(FormControl)(() => ({
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

export default function SingleSelect ({value = '', label, options, onValueChange}) {
  const handleChange = useCallback((event) => {
    onValueChange(event.target.value);
  }, [onValueChange]);

  return (
    <StyledFormControl variant="standard" size="small" fullWidth>
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <Select
        labelId="simple-select-label"
        id="simple-select"
        value={value}
        onChange={handleChange}
        label={label}
      >
        {
        options.length < 1 ?
        <MenuItem value="">
          <em>None</em>
        </MenuItem> :
        options.map((option, index) => (
          <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
        ))
        }
      </Select>
    </StyledFormControl>
  );
}