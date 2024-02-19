import {
  FormControl,
  InputLabel,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import styled from '@emotion/styled';
import StyledSelect from './StyledSelect';
import CheckedIcon from './Icons/CheckedIcon';
import { filterProps } from '@/common/utils';

const styleBorderBottom = (theme) => ({
  '& .MuiSelect-icon': {
    marginRight: '12px'
  },
  verticalAlign: 'bottom',
  '& .MuiInputBase-root.MuiInput-root': {
    padding: '0 12px',
    '&:not(:hover):before': {
      borderBottom: `1px solid ${theme.palette.border.lines}`,
    },
    '&:hover:not(.Mui-disabled, .Mui-error):before': {
      borderBottom: `2px solid ${theme.palette.border.hover}`,
    }
  },
})
const styleNoBorder = {
  margin: '0 0.5rem',
  verticalAlign: 'bottom',
  '& .MuiInputBase-root.MuiInput-root:before': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
}
export const StyledFormControl = styled(FormControl,
  filterProps('showBorder')
)(({ theme, showBorder }) => showBorder ? styleBorderBottom(theme) : styleNoBorder);

export const MenuItemIcon = styled(ListItemIcon)(() => ({
  width: '0.625rem',
  height: '0.625rem',
  fontSize: '0.625rem',
  marginRight: '0.6rem',
  minWidth: '0.625rem !important',
  svg: {
    fontSize: '0.625rem',
  },
}));

export const MenuItemIconWithAvatar = styled(ListItemIcon)(() => ({
  width: '1.255rem',
  height: '1.255rem',
  fontSize: '0.625rem',
  marginRight: '0.5rem',
  minWidth: '0.625rem !important',
  svg: {
    fontSize: '0.625rem',
  },
}));

export const StyledMenuItemIcon = styled(MenuItemIcon)(() => ({
  justifySelf: 'flex-end',
  justifyContent: 'flex-end',
  marginRight: '0rem',
  marginLeft: '1rem',
  svg: {
    fontSize: '0.75rem',
  },
}));

export const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const StyledMenuItem = styled(MenuItem)(() => ({
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
  onChange,
  displayEmpty,
  disabled = false,
  customSelectedColor,
  customSelectedFontSize,
  showOptionIcon = false,
  enableVersionListAvatar = false,
  showBorder,
  sx,
  id,
  name,
}) {
  const handleChange = useCallback(
    (event) => {
      if (onValueChange) {
        onValueChange(event.target.value);
      }
      if (onChange) {
        onChange(event);
      }
    },
    [onChange, onValueChange]
  );

  const renderValue = useCallback(
    (selectedValue) => {
      const foundOption = options.find(
        ({ value: itemValue }) => itemValue === selectedValue
      );
      return foundOption ? (
        !showOptionIcon ? (
          <ValueItem key={foundOption.value} value={foundOption.value}>
            {foundOption.label}
          </ValueItem>
        ) : (
          <ValueItem key={foundOption.value} value={foundOption.value}>
            {enableVersionListAvatar ? null : (
              <MenuItemIcon>{foundOption.icon}</MenuItemIcon>
            )}
            <ListItemText
              variant='bodyMedium'
              primary={
                <Typography variant='bodyMedium'>
                  {foundOption.label}
                </Typography>
              }
            />
          </ValueItem>
        )
      ) : (
        <em>None</em>
      );
    },
    [options, showOptionIcon, enableVersionListAvatar]
  );

  return (
    <StyledFormControl sx={sx} variant='standard' size='small' fullWidth showBorder={showBorder}>
      {label && <InputLabel sx={{ color: 'text.primary', left: '12px', fontSize: '14px' }} id='demo-simple-select-label'>{label}</InputLabel>}
      <StyledSelect
        labelId='simple-select-label'
        id={id || 'simple-select-' + label}
        name={name}
        value={options && options.length ? value : ''}
        disabled={disabled}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        customSelectedColor={customSelectedColor}
        customSelectedFontSize={customSelectedFontSize}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        label={label}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              marginTop: '8px',
            },
          },
        }}
      >
        {options.length < 1 ? (
          <StyledMenuItem value=''>
            <em>None</em>
          </StyledMenuItem>
        ) : (
          options.map((option) => {
            return !showOptionIcon ? (
              <StyledMenuItem key={option.value} value={option.value}>
                <Typography variant='bodyMedium'>
                  {option.label}
                </Typography>
                {option.value === value && (
                  <StyledMenuItemIcon>
                    <CheckedIcon />
                  </StyledMenuItemIcon>
                )}
              </StyledMenuItem>
            ) : (
              <StyledMenuItem key={option.value} value={option.value}>
                <StyledBox>
                  {enableVersionListAvatar ? (
                    <MenuItemIconWithAvatar>
                      {option.icon}
                    </MenuItemIconWithAvatar>
                  ) : (
                    <MenuItemIcon>{option.icon}</MenuItemIcon>
                  )}
                  <ListItemText
                    variant='bodyMedium'
                    primary={
                      <Typography variant='bodyMedium'>
                        {option.label} - {option.date}
                      </Typography>
                    }
                  />
                </StyledBox>
                {option.value === value && (
                  <StyledMenuItemIcon>
                    <CheckedIcon />
                  </StyledMenuItemIcon>
                )}
              </StyledMenuItem>
            );
          })
        )}
      </StyledSelect>
    </StyledFormControl>
  );
}
