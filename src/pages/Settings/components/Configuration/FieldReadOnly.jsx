import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';

export default function FieldReadOnly ({ label = '', value = '', boxStyles }) {
  const theme = useTheme();
  return (
    <Box sx={{
      padding: '8px 12px',
      width: '100%',
      borderBottom: `1px solid ${theme.palette.border.lines}`,
      ...boxStyles,
    }}>
      <Typography variant='bodySmall'>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant='bodyMedium'>
          {value}
        </Typography>
      </Box>
    </Box>
  )
}