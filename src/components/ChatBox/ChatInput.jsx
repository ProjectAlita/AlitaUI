import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { forwardRef, useCallback, useEffect, useState, useImperativeHandle } from 'react';
import SendIcon from '@/components/Icons/SendIcon';
import {
  ChatInputContainer,
  SendButton,
  SendButtonContainer,
  StyledCircleProgress,
  StyledTextField
} from '@/components/ChatBox/StyledComponents';
import { useCtrlEnterKeyEventsHandler } from '@/components/ChatBox/hooks';
import { StyledUnfoldLessIcon, StyledUnfoldMoreIcon } from '@/pages/Prompts/Components/Common';
import { useTheme } from '@emotion/react';


const MAX_ROWS = 15;
const MIN_ROWS = 3;
const MIN_HEIGHT = 70;

const ChatInput = forwardRef(function ChatInput(props, ref) {
  const {
    onSend,
    isLoading,
    disabledSend,
    sx,
    placeholder = 'Type your message',
    clearInputAfterSubmit = true
  } = props;
  const theme = useTheme();
  const [question, setQuestion] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [showExpandIcon, setShowExpandIcon] = useState(false);
  const [rows, setRows] = useState(MAX_ROWS);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setInputContent('');
      setQuestion('');
      setShowExpandIcon(false);
    },
    setValue: (value) => {
      setInputContent(value);
    }
  }));

  const onClickExpander = useCallback(
    () => {
      setRows((prevRows) => prevRows === MAX_ROWS ? MIN_ROWS : MAX_ROWS);
    },
    [],
  );

  const onInputQuestion = useCallback(
    (event) => {
      setInputContent(event.target.value);
      setQuestion(event.target.value?.trim() ? event.target.value : '');
      setShowExpandIcon(event.target.offsetHeight > MIN_HEIGHT);
    },
    [],
  );

  const onCtrlEnterDown = useCallback(() => {

    setInputContent((prevContent) => prevContent + '\n');
  }, [])

  const onEnterDown = useCallback(() => {
    if (question.trim() && !disabledSend) {
      onSend(question)
      if (clearInputAfterSubmit) {
        setInputContent('');
        setQuestion('');
        setShowExpandIcon(false);
      }
    }
  }, [disabledSend, onSend, question, clearInputAfterSubmit]);

  const { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd } = useCtrlEnterKeyEventsHandler({
    onCtrlEnterDown,
    onEnterDown,
  });

  useEffect(() => {
    if (!showExpandIcon) {
      setRows(MAX_ROWS);
    }
  }, [showExpandIcon]);

  return (
    <ChatInputContainer sx={sx}>
      <Box sx={{ flex: 1, marginRight: 1 }}>
        <StyledTextField
          value={inputContent}
          fullWidth
          id="standard-multiline-static"
          label=""
          multiline
          maxRows={rows}
          variant="standard"
          onChange={onInputQuestion}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          disabled={isLoading}
          placeholder={placeholder}
          InputProps={{
            style: { color: theme.palette.text.secondary },
            disableUnderline: true,
            endAdornment: showExpandIcon ? (
              <IconButton
                size='small'
                onClick={onClickExpander}
              >
                {rows === MAX_ROWS ? (
                  <StyledUnfoldLessIcon />
                ) : (
                  <StyledUnfoldMoreIcon />
                )}
              </IconButton>
            ) : null
          }}
        />
      </Box>
      <SendButtonContainer>
        <SendButton
          disabled={disabledSend || !question}
          onClick={onEnterDown}
          aria-label="send your question">
          <SendIcon sx={{ fontSize: 18, fill: 'icon.fill.send' }} />
        </SendButton>
        {isLoading && <StyledCircleProgress />}
      </SendButtonContainer>
    </ChatInputContainer>
  )
});

ChatInput.propTypes = {
}


export default ChatInput;