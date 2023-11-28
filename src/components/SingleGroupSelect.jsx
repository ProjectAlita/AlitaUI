import { GROUP_SELECT_VALUE_SEPARATOR } from '@/common/constants';
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import ListSubheader from '@mui/material/ListSubheader';
import { useCallback, useMemo } from "react";
import styled from '@emotion/styled';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import StyledSelect from './StyledSelect';

const StyledInputLabel = styled(InputLabel)(({theme}) => `
  color: ${theme.palette.text.input.label}
`);

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

export default function SingleGroupSelect({ value = '', label, options, onValueChange }) {
  const groups = useMemo(() => Object.keys(options), [options]);
  const handleChange = useCallback((event) => {
    const splittedValues = event.target.value.split(GROUP_SELECT_VALUE_SEPARATOR);
    onValueChange(splittedValues[0], splittedValues[1]);
  }, [onValueChange]);

  return (
    <StyledFormControl variant="standard" size="small" fullWidth>
      {label && <StyledInputLabel id="demo-simple-select-label">{label}</StyledInputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id="simple-select"
        value={groups.length ? value : ''}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        label={label}
      >
        {
          groups.length < 1
            ?
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            :
            groups.map((groupName, index) => {
              return (
                [
                  <ListSubheader key={groupName + index}>{groupName}</ListSubheader>,
                  ...(options[groupName].map((option) => {
                    return <MenuItem key={option.group + option.value} value={`${option.group}${GROUP_SELECT_VALUE_SEPARATOR}${option.value}`}>{option.label}</MenuItem>
                  }))
                ]
              )
            })
        }
      </StyledSelect>
    </StyledFormControl>
  );
}