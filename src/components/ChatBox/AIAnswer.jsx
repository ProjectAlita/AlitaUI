import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import { MuiMarkdown, getOverrides } from 'mui-markdown';

import AlitaIcon from '../Icons/AlitaIcon';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import RegenerateIcon from '../Icons/RegenerateIcon';

const UserMessageContainer = styled(ListItem)(() => `
  flex: 1 0 0
  display: flex;
  padding: 0.75rem;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 0.25rem;
`);

const Answer = styled(Box)(({ theme }) => `
  flex: 1 0 0;
  color:${theme.palette.text.secondary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
  background: ${theme.palette.background.activeBG};
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

const AlitaAvatar = styled(Avatar)(() => `
  padding: 0px;
  background: transparent;
`);

const AIAnswerContainer = styled(UserMessageContainer)(({ theme }) => `
  background: ${theme.palette.background.activeBG};
`);

const ButtonsContainer = styled(Box)(() => `
display: flex;
justify-content: flex-end;
align-items: flex-start;
gap: 0.5rem;
`);

const StyledDiv = styled('div')(() => `
  background: transparent;
`);

const AIAnswer = ({ answer, onCopy, onDelete, onRegenerate }) => {
  return (
    <AIAnswerContainer>
      <ListItemAvatar>
        <AlitaAvatar>
          <AlitaIcon sx={{ fontSize: 40 }} />
        </AlitaAvatar>
      </ListItemAvatar>
      <Answer>
        <ButtonsContainer>
          <IconButton onClick={onCopy}>
            <CopyIcon sx={{ fontSize: '1.13rem' }} />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon sx={{ fontSize: '1.13rem' }} />
          </IconButton>
          <IconButton onClick={onRegenerate} >
            <RegenerateIcon sx={{ fontSize: '1.13rem' }} />
          </IconButton>
        </ButtonsContainer>
        <MuiMarkdown overrides={{
          ...getOverrides(),
          div: {
            component: StyledDiv,
            props: {},
          },
        }}>
          {answer}
        </MuiMarkdown>
      </Answer>
    </AIAnswerContainer>
  )
}

export default AIAnswer;