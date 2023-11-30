import { FormControl, InputLabel, MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { useCallback } from "react";
import ArrowDownIcon from './Icons/ArrowDownIcon';
import styled from '@emotion/styled';
import StyledSelect from './StyledSelect';
import CheckedIcon from './Icons/CheckedIcon';

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

const MenuItemIcon = styled(ListItemIcon)(() => ({
  width: '0.625rem',
  height: '0.625rem',
  fontSize: '0.625rem',
  marginRight: '0.6rem',
  minWidth: '0.625rem !important',
  svg: {
    fontSize: '0.625rem'
  }
}));

const StyledMenuItemIcon = styled(MenuItemIcon)(() => ({
  justifySelf: 'flex-end',
  justifyContent: 'flex-end',
  marginRight: '0rem',
  svg: {
    fontSize: '0.75rem'
  }
}));

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  justifyContent: 'space-between',
}));

const ValueItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export default function SingleSelect({
  value = '',
  label,
  options,
  onValueChange,
  displayEmpty,
  customSelectedColor,
  customSelectedFontSize,
  showOptionIcon = false,
}) {
  const handleChange = useCallback((event) => {
    onValueChange(event.target.value);
  }, [onValueChange]);

  const renderValue = useCallback(
    (selectedValue) => {
      const foundOption = options.find(({ value: itemValue }) => itemValue === selectedValue);
      return (!showOptionIcon ?
        <ValueItem key={foundOption.value} value={foundOption.value}>
          {foundOption.label}
        </ValueItem>
        :
        <ValueItem key={foundOption.value} value={foundOption.value}>
          <MenuItemIcon>
            {foundOption.icon}
          </MenuItemIcon>
          <ListItemText primary={foundOption.label} />
        </ValueItem>);
    },
    [options, showOptionIcon],
  );

  return (
    <StyledFormControl variant="standard" size="small" fullWidth>
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id={"simple-select-" + label}
        value={options && options.length ? value : ''}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        customSelectedColor={customSelectedColor}
        customSelectedFontSize={customSelectedFontSize}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        label={label}
      >
        {
          options.length < 1
            ?
            <StyledMenuItem value="">
              <em>None</em>
            </StyledMenuItem>
            :
            options.map((option) => {
              return !showOptionIcon ?
                <StyledMenuItem key={option.value} value={option.value}>
                  {option.label}
                  {
                    option.value === value &&
                    <StyledMenuItemIcon>
                      <CheckedIcon />
                    </StyledMenuItemIcon>
                  }
                </StyledMenuItem>
                :
                <StyledMenuItem key={option.value} value={option.value}>
                  <StyledBox>
                    <MenuItemIcon>
                      {option.icon}
                    </MenuItemIcon>
                    <ListItemText primary={option.label} />
                  </StyledBox>
                  {
                    option.value === value &&
                    <StyledMenuItemIcon>
                      <CheckedIcon />
                    </StyledMenuItemIcon>
                  }
                </StyledMenuItem>;
            })
        }
      </StyledSelect>
    </StyledFormControl>
  );
}