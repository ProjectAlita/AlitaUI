import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';


const Input = styled(MuiInput)(({ theme }) => `
  ::before {
    border-bottom: 1px solid ${theme.palette.border.lines} !important
  }
  & input[type=number] {
    MozAppearance: textfield;
  }
  & input[type=number]::-webkit-outer-spin-button {
    WebkitAppearance: none;
    display: none;
    margin: 0;
  }
  & input[type=number]::-webkit-inner-spin-button {
    WebkitAppearance: none;
    display: none;
    margin: 0;
  }
`);

const StyledGrid = styled(Grid)`
  padding-left: 0.5rem;
`;

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.text.primary,
}))

const StyledBox = styled(Box)`
  flex: 1;
`;

export default function InputSlider({ label, defaultValue, range = [0, 1], step = 0.1, onChange }) {
  const [value, setValue] = React.useState(defaultValue);

  const handleSliderChange = React.useCallback((event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue)
    }
  }, [onChange]);

  const handleInputChange = React.useCallback((event) => {
    setValue(event.target.value === '' ? range[0] : Number(event.target.value));
  }, [range]);

  const handleBlur = React.useCallback(() => {
    if (value < range[0]) {
      setValue(range[0]);
    } else if (value > range[1]) {
      setValue(range[1]);
    }
  }, [value, range]);

  return (
    <StyledBox>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <StyledSlider
            size="small"
            step={step}
            min={range[0]}
            max={range[1]}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <StyledGrid >
          <Input
            id={label + new Date().getTime()}
            value={typeof value === 'number' ? value : 0}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step,
              min: range[0],
              max: range[1],
              style: { textAlign: 'center' },
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </StyledGrid>
      </Grid>
    </StyledBox>
  );
}