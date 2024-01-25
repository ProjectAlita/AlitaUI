import  {useTheme } from '@mui/material/styles';
import { getStatusColor } from '@/common/utils';
import { Box } from '@mui/material';

export default function StatusBar ({status}) {
  const theme = useTheme();
  return <Box sx={{
    background: getStatusColor(status, theme),
    width: '3px',
    height: '28px',
    borderRadius: '4px',
  }} />;
}