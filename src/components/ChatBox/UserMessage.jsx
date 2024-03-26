import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';

import { useSelector } from 'react-redux';
import UserAvatar from '@/components/UserAvatar';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import StyledTooltip from '../Tooltip';
import CopyMoveIcon from '../Icons/CopyMoveIcon';
import IconButton from '@mui/material/IconButton';

const UserMessageContainer = styled(ListItem)(() => `
  flex: 1 0 0
  display: flex;
  padding: 0.75rem;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 0.25rem;
  margin-bottom: 8px;
`);

const Message = styled(Box)(({ theme }) => `
  flex: 1 0 0;
  color: ${theme.palette.text.secondary};
`);

const ButtonsContainer = styled(Box)(({ theme }) => `
position: absolute;
top: 6px;
right: 6px;
display: flex;
justify-content: flex-end;
align-items: flex-start;
gap: 0.5rem;
padding-left: 32px;
padding-bottom: 2px;
background: ${theme.palette.background.userMessageActions};
`);

const UserMessage = React.forwardRef((props, ref) => {
  const { content, onCopy, onCopyToMessages, onDelete } = props;
  const avatar = useSelector((state) => state.user?.avatar);
  const userName = useSelector((state) => state.user?.name);
  const [showActions, setShowActions] = useState(false);
  const onMouseEnter = useCallback(
    () => {
      setShowActions(true);
    },
    [],
  )
  const onMouseLeave = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )

  return (
    <UserMessageContainer ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ListItemAvatar sx={{ minWidth: '24px' }}>
        <UserAvatar name={userName} avatar={avatar} size={24} />
      </ListItemAvatar>
      <Message>
        {
          content.split('\n').map((string, index) =>
          (<Box key={index}>
            <Typography sx={{
              whiteSpace: 'normal',
              overflowWrap: 'break-word', 
              wordWrap: 'break-word',
            }} variant='bodyMedium'>
              {string}
            </Typography>
          </Box>))
        }
        {showActions && <ButtonsContainer>
          {
            onCopy &&
            <StyledTooltip title={'Copy to clipboard'} placement="top">
              <IconButton onClick={onCopy}>
                <CopyIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
          {
            onCopyToMessages &&
            <StyledTooltip title={'Copy to Messages'} placement="top">
              <IconButton onClick={onCopyToMessages}>
                <CopyMoveIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
          {
            onDelete &&
            <StyledTooltip title={'Delete'} placement="top">
              <IconButton onClick={onDelete}>
                <DeleteIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
        </ButtonsContainer>}
      </Message>
    </UserMessageContainer>
  )
})

UserMessage.displayName = 'UserMessage';


export default UserMessage;