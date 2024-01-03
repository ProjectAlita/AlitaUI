import { GROUP_SELECT_VALUE_SEPARATOR } from '@/common/constants';
import { FormControl, InputLabel, MenuItem, ListItemIcon } from "@mui/material";
import ListSubheader from '@mui/material/ListSubheader';
import { useCallback, useMemo } from "react";
import styled from '@emotion/styled';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import StyledSelect from './StyledSelect';
import CheckedIcon from './Icons/CheckedIcon';
import { typographyVariants } from '@/MainTheme';


const StyledFormControl = styled(FormControl)(({ theme }) => ({
  verticalAlign: 'bottom',
  '& .MuiFormLabel-root': {
    color: theme.palette.text.input.label,
    left: '12px',
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiButtonBase-root.MuiMenuItem-root': {
    padding: '0px 12px',
    ...typographyVariants.bodyMedium
  },
  '& .MuiInputBase-root.MuiInput-root:before': {
    borderBottomColor: theme.palette.border.lines
  },
  '& .MuiInputBase-root.MuiInput-root:hover:before': {
    borderBottomColor: theme.palette.icon.fill.default
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

const StyledMenuItemIcon = styled(ListItemIcon)(() => ({
  justifySelf: 'flex-end',
  justifyContent: 'flex-end',
  width: '0.625rem',
  height: '0.625rem',
  fontSize: '0.625rem',
  minWidth: '0.625rem',
  marginRight: '0.5rem',
  svg: {
    fontSize: '0.75rem'
  }
}));

export default function SingleGroupSelect({ value = '', label, options, onValueChange }) {
  const groups = useMemo(() => Object.keys(options), [options]);
  const handleChange = useCallback((event) => {
    const splittedValues = event.target.value.split(GROUP_SELECT_VALUE_SEPARATOR);
    onValueChange(splittedValues[0], splittedValues[1]);
  }, [onValueChange]);

  const renderValue = useCallback(
    (selectedValue) => {
      const splittedValues = selectedValue.split(GROUP_SELECT_VALUE_SEPARATOR);
      const groupedOptions = Object.values(options);
      const foundGroup = groupedOptions.find((groupedOption) => groupedOption[0].group === splittedValues[0]);
      const foundOption = foundGroup?.find(({ value: itemValue }) => itemValue === splittedValues[1]);
      return (
        <MenuItem
          value={splittedValues}>
          {foundOption?.label}
        </MenuItem>);
    },
    [options],
  );

  return (
    <StyledFormControl variant="standard" size="small" fullWidth>
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id="simple-select"
        value={groups.length ? value : ''}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        renderValue={renderValue}
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
                    const itemValue = `${option.group}${GROUP_SELECT_VALUE_SEPARATOR}${option.value}`;
                    return (
                      <MenuItem
                        sx={{justifyContent: 'space-between'}}
                        key={option.group + option.value}
                        value={itemValue}>
                        {option.label}
                        {
                          itemValue === value &&
                          <StyledMenuItemIcon>
                            <CheckedIcon />
                          </StyledMenuItemIcon>
                        }
                      </MenuItem>);
                  }))
                ]
              )
            })
        }
      </StyledSelect>
    </StyledFormControl>
  );
}