import { GROUP_SELECT_VALUE_SEPARATOR } from '@/common/constants';
import { FormControl, InputLabel, MenuItem, ListItemIcon, Typography, Box } from "@mui/material";
// import ListSubheader from '@mui/material/ListSubheader';
import { useCallback, useMemo } from "react";
import styled from '@emotion/styled';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import StyledSelect from './StyledSelect';
import CheckedIcon from './Icons/CheckedIcon';
import { typographyVariants } from '@/MainTheme';
import { genModelSelectValue } from '@/common/promptApiUtils';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme } from '@emotion/react';


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

export default function SingleGroupSelect({
  value = '',
  label,
  disabled = false,
  options,
  onValueChange,
  sx,
  extraSelectedContent,
  error,
  helperText,
  required
}) {
  const theme = useTheme();
  const groups = useMemo(() => Object.keys(options), [options]);
  const realValue = useMemo(() => {
    const splittedValues = value.split(GROUP_SELECT_VALUE_SEPARATOR).filter(splittedValue => splittedValue);
    if (splittedValues.length === 3) {
      return value;
    } else {
      const groupedOptions = Object.values(options).filter(item => item.length);
      const foundGroup = groupedOptions.find((groupedOption) => groupedOption[0]?.group === splittedValues[0]);
      return genModelSelectValue(splittedValues[0], splittedValues[1], foundGroup ? foundGroup[0]?.group_name : '');
    }
  }, [options, value]);

  const handleChange = useCallback((event) => {
    const splittedValues = event.target.value.split(GROUP_SELECT_VALUE_SEPARATOR);
    onValueChange(splittedValues[0], splittedValues[1], splittedValues[2]);
  }, [onValueChange]);

  const renderValue = useCallback(
    (selectedValue) => {
      const splittedValues = selectedValue.split(GROUP_SELECT_VALUE_SEPARATOR);
      const groupedOptions = Object.values(options).filter(item => item.length);
      const foundGroup = groupedOptions.find((groupedOption) => groupedOption[0]?.group === splittedValues[0]);
      const foundOption = foundGroup?.find(({ value: itemValue }) => itemValue === splittedValues[1]);
      return (
        <MenuItem
          sx={{ justifyContent: 'space-between', width: '100%' }}
          value={splittedValues}>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: '60%'
            }}
            variant='bodyMedium'>
            {foundOption?.label}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} >
            <Typography color={'text.default'} variant='bodySmall'>
              {foundOption?.config_name}
            </Typography>
            {
              extraSelectedContent
            }
          </Box>
        </MenuItem>);
    },
    [extraSelectedContent, options],
  );

  return (
    <StyledFormControl required={required} error={error} variant="standard" size="small" fullWidth sx={sx}>
      {label && <InputLabel sx={{ fontSize: '14px' }} id="demo-simple-select-label">{label}</InputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id="simple-select"
        disabled={disabled}
        value={groups.length ? realValue : ''}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        renderValue={renderValue}
        label={label}
        MenuProps={{
          style: { maxHeight: '480px' }  // Set the max height here
        }}
      >
        {
          groups.length < 1
            ?
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            :
            groups.map((groupName) => {
              return (
                [
                  // <ListSubheader key={groupName + index}>{groupName}</ListSubheader>,
                  ...(options[groupName].map((option) => {
                    const itemValue = genModelSelectValue(option.group, option.value, option.group_name);
                    return (
                      <MenuItem
                        sx={{ justifyContent: 'space-between' }}
                        key={option.group + option.value}
                        value={itemValue}>
                        <Typography color='text.secondary' variant='bodyMedium'>
                          {option.label}
                        </Typography>
                        {
                          itemValue === value &&
                          <StyledMenuItemIcon>
                            <CheckedIcon fill={theme.palette.text.secondary} />
                          </StyledMenuItemIcon>
                        }
                        <Typography sx={{ marginLeft: '16px' }} color={'text.default'} variant='bodySmall'>
                          {groupName}
                        </Typography>
                      </MenuItem>);
                  }))
                ]
              )
            })
        }
      </StyledSelect>
      <FormHelperText>{helperText}</FormHelperText>
    </StyledFormControl>
  );
}