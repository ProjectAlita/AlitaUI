import { useMemo } from "react";
import SingleSelect from '@/components/SingleSelect';
import { Box, Typography } from '@mui/material';


export default function AuthenticationSelect({
  onValueChange = () => { },
  value,
  required,
  error,
  helperText,
  sx = {},
}) {
  const authenticationOptions = useMemo(() => [{ label: 'None', value: 'none' }], []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', ...sx }}>
      <Box sx={{ height: '40px', padding: '0px 0px 0px 12px', gap: '10px', display: 'flex', alignItems: 'end' }}>
        <Typography sx={{ textTransform: 'uppercase' }} variant='bodyMedium' color={'default'}>
          Authentication
        </Typography>
      </Box>
      <SingleSelect
        showBorder
        name='authentication'
        label='Authentication'
        onValueChange={onValueChange}
        value={value}
        options={authenticationOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{ marginTop: '8px' }}
        required={required}
        error={error}
        helperText={helperText}
      />
    </Box>

  )
}