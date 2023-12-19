import { InputLabel, ListItemText, Box, Typography } from "@mui/material";
import { useCallback } from "react";
import ArrowDownIcon from './Icons/ArrowDownIcon';
import styled from '@emotion/styled';
import StyledSelect from './StyledSelect';
import CheckedIcon from './Icons/CheckedIcon';
import { StyledFormControl, StyledMenuItem, StyledMenuItemIcon, StyledBox, MenuItemIcon } from './SingleSelect';

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
}) {
  const handleChange = useCallback((event) => {
    onValueChange(event.target.value);
  }, [onValueChange]);

  const renderValue = useCallback(
    (selectedValue) => {
      const foundOptions = options.filter(({ value: itemValue }) => !!selectedValue.find(selectedItem => selectedItem === itemValue)).map(item => item.label);
      return foundOptions.length ?
        <ValueItem>
          {foundOptions.join(',')}
        </ValueItem>
        : <div>All Statuses</div>;
    },
    [options],
  );

  return (
    <StyledFormControl variant="standard" size="small" fullWidth>
      {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
      <StyledSelect
        labelId="simple-select-label"
        id={"simple-select-" + label}
        value={options && options.length ? value : []}
        onChange={handleChange}
        IconComponent={ArrowDownIcon}
        customSelectedColor={customSelectedColor}
        customSelectedFontSize={customSelectedFontSize}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        multiple
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
    </StyledFormControl>
  );
}