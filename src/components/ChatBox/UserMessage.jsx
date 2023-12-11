import { Box } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import { MuiMarkdown } from 'mui-markdown';

import { useSelector } from 'react-redux';
import UserAvatar from '@/components/UserAvatar';

const UserMessageContainer = styled(ListItem)(() => `
  flex: 1 0 0
  display: flex;
  padding: 0.75rem;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 0.25rem;
`);

const Message = styled(Box)(({theme}) => `
  flex: 1 0 0;
  color: ${theme.palette.text.secondary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
`);

const UserMessage = ({ content }) => {
  const avatar = useSelector((state) => state.user?.avatar);
  const userName = useSelector((state) => state.user?.name);
  return (
    <UserMessageContainer>
      <ListItemAvatar>
        <UserAvatar name={userName} avatar={avatar} size={40}/>
      </ListItemAvatar>
      <Message>
        <MuiMarkdown>
          {content}
        </MuiMarkdown>
      </Message>
    </UserMessageContainer>
  )
}

export default UserMessage;