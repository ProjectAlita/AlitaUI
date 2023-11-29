import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { PropTypes } from 'prop-types';

export default function NotificationButton({ hasMessages, onClick }) {
  const StyledNotificationsNoneIcon = styled(NotificationsNoneIcon)(({ theme }) => `
    fill: ${theme.palette.text.primary};
  `)
  return (
    <IconButton
      size="large"
      aria-label="show 17 new notifications"
      color="inherit"
      onClick={onClick}
    >
      {
        hasMessages ?
          <Badge variant="dot" color='error'>
            <StyledNotificationsNoneIcon />
          </Badge>
          :
          <StyledNotificationsNoneIcon />
      }
    </IconButton>
  )

}

NotificationButton.propTypes = {
  hasMessages: PropTypes.bool,
  onClick: PropTypes.func,
}
