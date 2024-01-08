import  {useTheme } from '@mui/material/styles';
import { getStatusColor } from '@/common/utils';

import CircleIcon from './Icons/CircleIcon';

export function StatusDot ({status, size = '10px'}) {
  const theme = useTheme();
  return <CircleIcon fill={getStatusColor(status, theme)} size={size}/>;
}