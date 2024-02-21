import SuccessIcon from '@/components/Icons/SuccessIcon';
import { useTheme } from '@emotion/react';
import Tooltip from '@/components/Tooltip';
import { Box } from '@mui/material';

const ModelCompatibleIcon = () => {
  const theme = useTheme();
  return (
    <Tooltip title={'Embedding model is compatible with the model of this datasource.'} placement='top'>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <SuccessIcon
          fill={theme.palette.status.published}
          style={{ marginLeft: '10px' }}
          fontSize={'16px'}
        />
      </Box>
    </Tooltip>
  );
}

export default ModelCompatibleIcon;