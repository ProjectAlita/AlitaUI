import { Box, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from "@mui/material";

export default function RadioButtonGroup({
  disabled = false,
  value,
  defaultValue,
  onChange,
  items,
}) {
  const theme = useTheme();
  return (
    <RadioGroup
      aria-labelledby="radio-buttons-group-label"
      defaultValue={defaultValue}
      name="radio-buttons-group"
      value={value}
      onChange={onChange}
    >
      {
        items.map(item => (<Box key={item.value} display='flex' flexDirection='column'>
          <FormControlLabel
            sx={{
              alignItems: 'flex-start',
              mb: '8px',
            }}
            value={item.value}
            control={<Radio disabled={disabled} />}
            label={
              <>
                <Typography 
                component='div'
                variant='labelMedium' 
                color={theme.palette.text.secondary} 
                sx={{ mt: '7px' }}>
                  {item.label} 
                </Typography>
                {item.description && <Typography component='div' variant='bodySmall'>
                  {item.description}
                </Typography>}
              </>
            }
          />
        </Box>
        ))
      }
    </RadioGroup>
  );
}