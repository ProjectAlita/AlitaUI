import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const Input = styled(MuiInput)`
  width: 42px;
`;

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.text.primary,
}))

export default function InputSlider({label, defaultValue, range = [0, 1]}) {
  const [value, setValue] = React.useState(defaultValue);

  const handleSliderChange = React.useCallback((event, newValue) => {
    setValue(newValue);
  },[]);

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
    <>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <StyledSlider
            size="small"
            step={0.1}
            min={range[0]}
            max={range[1]}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 0.1,
              min: range[0],
              max: range[1],
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}