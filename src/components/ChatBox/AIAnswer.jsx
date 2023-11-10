import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import { MuiMarkdown } from 'mui-markdown';

import AlitaIcon from '../Icons/AlitaIcon';

const UserMessageContainer = styled(ListItem)(() => `
  flex: 1 0 0
  display: flex;
  padding: 0.75rem;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 0.25rem;
`);

const Answer = styled(Box)(({theme}) => `
  flex: 1 0 0;
  color:${theme.palette.text.secondary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
`);

const UserAvatar = styled(Avatar)(() => `
  padding: 0px;
`);

const AIAnswerContainer = styled(UserMessageContainer)(({theme}) => `
  background: ${theme.palette.background.activeBG};
`);

const AIAnswer = ({ answer }) => {
  return (
    <AIAnswerContainer>
      <ListItemAvatar>
        <UserAvatar>
          <AlitaIcon sx={{ fontSize: 40 }} />
        </UserAvatar>
      </ListItemAvatar>
      <Answer>
        <MuiMarkdown>
          {answer}
        </MuiMarkdown>
      </Answer>
    </AIAnswerContainer>
  )
}

export default AIAnswer;