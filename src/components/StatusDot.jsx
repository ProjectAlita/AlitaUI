import  {useTheme } from '@mui/material/styles';
import CircleIcon from './Icons/CircleIcon';

export function StatusDot ({status, size = 'auto'}) {
  const theme = useTheme();
  let color = '';
  switch (status) {
    case 'draft':
      color = theme.palette.status.draft;
      break;
    case 'on_moderation':
      color = theme.palette.status.onModeration;
      break;
    case 'published':
      color = theme.palette.status.published;
      break;
    case 'rejected':
      color = theme.palette.status.rejected;
      break;
    case 'user_approval':
      color = theme.palette.status.userApproval;
      break;
    default:
      break;
  }
  return <CircleIcon fill={color} size={size}/>;
}