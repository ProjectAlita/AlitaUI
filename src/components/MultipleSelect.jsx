import styled from '@emotion/styled';
import { Box, FormHelperText, InputLabel, ListItemText, Typography } from "@mui/material";
import { useCallback } from "react";
import ArrowDownIcon from './Icons/ArrowDownIcon';
import CheckedIcon from './Icons/CheckedIcon';
import { MenuItemIcon, StyledBox, StyledFormControl, StyledMenuItem, StyledMenuItemIcon } from './SingleSelect';
import StyledSelect from './StyledSelect';

const ValueItem = styled(Box)(() => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '200px',
  wordWrap: 'break-word',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '1',
}));

export default function MultipleSelect({
  value = [],
  label,
  options,
  onValueChange,
  displayEmpty = true,
  customSelectedColor,
  customSelectedFontSize,
  showOptionIcon = false,
  showBorder,
  multiple = true,
  sx,
  id,
  name,
  emptyPlaceHolder = 'All Statuses',
  customRenderValue,
  labelSX,
  selectSX,
  required,
  error,
  helperText
}) {
  const handleChange = useCallback((event) => {
    onValueChange(multiple ? event.target.value : [event.target.value]);
  }, [multiple, onValueChange]);

  const renderValue = useCallback(
    (selectedValue) => {
      const foundOptions = options.filter(({ value: itemValue }) => !!selectedValue.find(selectedItem => selectedItem === itemValue)).map(item => item.label);
      return foundOptions.length ?
        <ValueItem>
          {customRenderValue ? customRenderValue(foundOptions) : foundOptions.join(',')}
        </ValueItem>
        : <div>{emptyPlaceHolder}</div>;
    },
    [customRenderValue, emptyPlaceHolder, options],
  );

  return (
    <StyledFormControl sx={sx} variant='standard' size='small' fullWidth showBorder={showBorder}
      required={required} error={error}>
      {label && <InputLabel sx={{
        color: 'text.primary',
        fontSize: '14px',
        top: value.length ? '0px' : '-6px',
        '&.Mui-focused': {
          top: '0px',
        },
        ...labelSX
      }} id="demo-simple-select-label">{label}</InputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id={id || 'simple-select-' + label}
        name={name}
        value={options && options.length ? value : []}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        customSelectedColor={customSelectedColor}
        customSelectedFontSize={customSelectedFontSize}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        sx={{
          paddingTop: '7px !important',
          paddingBottom: '0  !important',
          '& .MuiSelect-icon': {
            top: 'calc(50% - 6px) !important;'
          },
          ...(selectSX || {})
        }}
        multiple={multiple}
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
                  <Typography variant='bodyMedium'>
                    {option.label}
                  </Typography>
                  {
                    value.find(item => item === option.value) &&
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
                    <ListItemText
                      variant="bodyMedium"
                      primary={
                        <Typography variant="bodyMedium">{
                          option.label}
                        </Typography>
                      }
                    />
                  </StyledBox>
                  {
                    value.find(item => item === option.value) &&
                    <StyledMenuItemIcon>
                      <CheckedIcon />
                    </StyledMenuItemIcon>
                  }
                </StyledMenuItem>;
            })
        }
      </StyledSelect>
      <FormHelperText>{error ? helperText : ''}</FormHelperText>
    </StyledFormControl>
  );
}