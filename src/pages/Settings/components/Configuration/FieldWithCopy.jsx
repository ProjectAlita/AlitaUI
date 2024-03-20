import { handleCopy } from '@/common/utils';
import CopyIcon from '@/components/Icons/CopyIcon';
import Toast from '@/components/Toast.jsx';
import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

export default function FieldWithCopy ({ label = '', value = '', boxStyles }) {
  const theme = useTheme();
  const [openToast, setOpenToast] = useState(false);

  const onCopy = useCallback(() => {
    handleCopy(value)
    setOpenToast(true);
  }, [value]);

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
  }, []);
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
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
        <Typography variant='bodyMedium'>
          {value}
        </Typography>
        <Box sx={{ cursor: 'pointer' }} onClick={onCopy}>
          <CopyIcon sx={{ fontSize: '16px' }} />
        </Box>
        <Toast
          open={openToast}
          severity={'info'}
          message={`The ${label} is copied to clipboard`}
          onClose={onCloseToast}
        />
      </Box>
    </Box>
  )
}