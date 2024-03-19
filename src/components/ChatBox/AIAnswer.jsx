import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import Markdown from '../Markdown';

import AlitaIcon from '../Icons/AlitaIcon';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import RegenerateIcon from '../Icons/RegenerateIcon';
import StyledTooltip from '../Tooltip';
import CopyMoveIcon from '../Icons/CopyMoveIcon';
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import BasicAccordion from "@/components/BasicAccordion.jsx";
import AnimatedProgress from '@/components/AnimatedProgress';

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

const Answer = styled(Box)(({ theme }) => `
  min-height: 36px; 
  flex: 1 0 0;
  color:${theme.palette.text.secondary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
  background: transparent;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

const AIAnswerContainer = styled(UserMessageContainer)(({ theme }) => `
  background: ${theme.palette.background.icon.default};
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
background: ${theme.palette.background.aiAnswerActions};
`);

const ReferenceList = ({ references }) => {
  return (
    <List dense>
      {
        references.map(i => (
          <ListItem key={i}>
            <ListItemText
              primary={<Markdown>{i}</Markdown>}
            />
          </ListItem>
        ))
      }
    </List>
  )
}

const AIAnswer = React.forwardRef((props, ref) => {
  const { answer, hasActions = true, onCopy, onCopyToMessages, onDelete, onRegenerate, shouldDisableRegenerate, references = [], isLoading = false } = props
  const [showActions, setShowActions] = useState(false);
  const onMouseEnter = useCallback(
    () => {
      if (hasActions) {
        setShowActions(true);
      }
    },
    [hasActions],
  )
  const onMouseLeave = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )

  return (
    <AIAnswerContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ListItemAvatar sx={{ minWidth: '24px' }}>
        <AlitaIcon sx={{ fontSize: 24 }} />
      </ListItemAvatar>
      <Answer>
        {showActions && <ButtonsContainer>
          {
            onCopy && <StyledTooltip title={'Copy to clipboard'} placement="top">
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
            onRegenerate &&
            <StyledTooltip title={'Regenerate'} placement="top">
              <div>
              <IconButton disabled={shouldDisableRegenerate} onClick={onRegenerate} >
                <RegenerateIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
              </div>
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
        <Markdown>
          {answer}
        </Markdown>
        {isLoading && <AnimatedProgress
          sx={{
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "32px",
          }}
          message='Thinking...'
          duration='2s'
        />}
        <div ref={ref} />
        {references?.length > 0 && <BasicAccordion style={{ marginTop: '15px' }} items={[
          { title: 'References', content: <ReferenceList references={references} /> }
        ]} />}
      </Answer>
    </AIAnswerContainer>
  )
})

AIAnswer.displayName = 'AIAnswer'

export default AIAnswer;