import BellIcon from '@/components/Icons/BellIcon';
import IconButton from '@mui/material/IconButton';
import { PropTypes } from 'prop-types';

export default function NotificationButton({ hasMessages, onClick }) {

  return (
    <IconButton
      size="large"
      aria-label="show 17 new notifications"
      color="inherit"
      sx= {{padding: '4px'}}
      onClick={onClick}
    >
      <BellIcon hasMessages={hasMessages} />
    </IconButton>
  )

}

NotificationButton.propTypes = {
  hasMessages: PropTypes.bool,
  onClick: PropTypes.func,
}
