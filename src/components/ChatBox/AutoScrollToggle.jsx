import Tooltip from '@/components/Tooltip';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import { useEffect, useState } from 'react';
import { ToggleButton} from './StyledComponents';

export const AUTO_SCROLL_KEY = 'project_alita.chat.autoscroll';

export default function AutoScrollToggle () {
  const [isAutoScroll, setIsAutoScroll] = useState(sessionStorage.getItem(AUTO_SCROLL_KEY) || true);

  useEffect(() => {
    sessionStorage.setItem(AUTO_SCROLL_KEY, isAutoScroll ? 'true': 'false');
  }, [isAutoScroll])

  return (
    <Tooltip title='Auto scroll to bottom' placement='top'>
      <ToggleButton
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => setIsAutoScroll((prevState) => !prevState)}
        isAutoScroll={isAutoScroll}
      >
        <KeyboardDoubleArrowDownOutlinedIcon sx={{ fontSize: 16 }} />
      </ToggleButton>
    </Tooltip>
  )
}