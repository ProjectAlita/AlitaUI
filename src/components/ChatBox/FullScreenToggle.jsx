import Tooltip from '@/components/Tooltip';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import { useCallback } from 'react';
import { ActionButton } from './StyledComponents';

export default function FullScreenToggle({
  isFullScreenChat,
  setIsFullScreenChat
}) {
  const handleToggle = useCallback((value) => () => {
    setIsFullScreenChat(value)
  }, [setIsFullScreenChat]);

  return isFullScreenChat ?
    <Tooltip title='Exit fullscreen mode' placement='top'>
      <ActionButton
        onClick={handleToggle(false)}
        sx={{ height: '28px', width: '28px' }}
      >
        <FullscreenExitOutlinedIcon sx={{ fontSize: 16 }} />
      </ActionButton>
    </Tooltip> :
    <Tooltip title='Fullscreen mode' placement='top'>
      <ActionButton
        onClick={handleToggle(true)}
        sx={{ height: '28px', width: '28px' }}
      >
        <FullscreenOutlinedIcon sx={{ fontSize: 16 }} />
      </ActionButton>
    </Tooltip>
}