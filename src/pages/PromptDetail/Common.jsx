import {
  PROMPT_MODE,
  PROMPT_PAGE_INPUT,
  PROMPT_PAYLOAD_KEY,
} from '@/common/constants.js';
import { Avatar, Box, Grid, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUpdateCurrentPrompt, useUpdateVariableList } from './hooks';

export const LeftContentContainer = styled(Box)(() => ({
  'overflowY': 'scroll',
  height: 'calc(100vh - 8.6rem)'
}));

export const StyledGridContainer = styled(Grid)(() => ({
  padding: 0,
}));

export const VersionSelectContainer = styled('div')(() => ({
  display: 'inline-block',
  marginRight: '2rem',
  width: '4rem',
}));

export const LeftGridItem = styled(Grid)(() => ({
  position: 'relative',
  padding: '0 0.75rem',
}));

export const RightGridItem = styled(Grid)(() => ({
  padding: '0 0.75rem',
}));

export const StyledInput = styled(TextField)(() => ({
  marginBottom: '0.75rem',
  '& .MuiFormLabel-root': {
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    top: '-0.25rem',
    left: '0.75rem',
  },
  '& .MuiInputBase-root': {
    padding: '1rem 0.75rem',
    marginTop: '0',
  },
  '& input[type=number]': {
    'MozAppearance': 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    'WebkitAppearance': 'none',
    margin: 0
  }
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  flex: '0 0 1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.main,
}));

export const TabBarItems = styled('div')(() => ({
  position: 'absolute',
  top: '-3.7rem',
  right: '0.5rem',
}));

export const SelectLabel = styled(Typography)(() => ({
  display: 'inline-block',
}));

export const StyledInputEnhancer = (props) => {
  const {
    editswitcher = false,
    editswitchconfig = {},
    payloadkey,
    label,
    onDrop,
    onDragOver,
    onBlur,
  } = props;
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [updateVariableList] = useUpdateVariableList();
  const [updateCurrentPrompt] = useUpdateCurrentPrompt();
  const [mode, setMode] = useState(PROMPT_MODE.Edit);
  const [disableSingleClickFocus, setDisableSingleClickFocus] = useState(
    false
  );
  const { promptId } = useParams();

  const theValue = useMemo(() => {
    const originalValue = currentPrompt && currentPrompt[payloadkey];
    if (payloadkey !== PROMPT_PAYLOAD_KEY.variables) {
      return originalValue
    } else {
      return originalValue.find((item) => item.key === label).value;
    }
  }, [currentPrompt, label, payloadkey]);

  const [value, setValue] = useState('');

  const handlers = {
    onBlur: useCallback(
      (event) => {
        if (onBlur) {
          onBlur(event);
        }
        setDisableSingleClickFocus(mode === PROMPT_MODE.View);
        if (payloadkey === PROMPT_PAYLOAD_KEY.variables){ 
          return;
        }
        const { target } = event;
        const inputValue = target?.value;
        if (payloadkey === PROMPT_PAYLOAD_KEY.context) {
          updateVariableList(inputValue);
        } else {
          updateCurrentPrompt(payloadkey, inputValue);
        }
      },
      [mode, onBlur, payloadkey, updateCurrentPrompt, updateVariableList]
    ),
    onChange: useCallback((event) => {
      const { target } = event;
      setValue(target?.value);
    }, []),
    onDrop: useCallback(
      (event) => {
        event.preventDefault();
        if (onDrop) onDrop(event);
        setDisableSingleClickFocus(mode === PROMPT_MODE.View);
      },
      [mode, onDrop]
    ),
    onDragOver: useCallback(
      (event) => {
        event.preventDefault();
        if (onDragOver) onDragOver(event);
        if (disableSingleClickFocus) setDisableSingleClickFocus(false);
      },
      [disableSingleClickFocus, onDragOver]
    ),
    onKeyPress: useCallback(
      () => {
        if (disableSingleClickFocus) {
          setDisableSingleClickFocus(false);
        }
        setMode(PROMPT_MODE.Edit);
      },
      [disableSingleClickFocus]
    ),
  };

  useEffect(() => {
    if (payloadkey === PROMPT_PAYLOAD_KEY.tags) {
      setValue(theValue?.map((tag) => tag?.tag).join(','));
    } else {
      setValue(theValue);
    }
  }, [payloadkey, theValue]);

  useEffect(() => {
    if (promptId) {
      setMode(PROMPT_MODE.View);
      setDisableSingleClickFocus(true);
    }
  }, [promptId]);

  return (
    <StyledInput
      variant='standard'
      fullWidth
      sx={{
        '.MuiInputBase-input': {
          maxHeight: editswitcher
            ? disableSingleClickFocus
              ? editswitchconfig.inputHeight || PROMPT_PAGE_INPUT.ROWS.TWO
              : '100%'
            : '100%',
          WebkitLineClamp: editswitcher
            ? disableSingleClickFocus
              ? editswitchconfig.inputHeight === PROMPT_PAGE_INPUT.ROWS.Three
                ? PROMPT_PAGE_INPUT.CLAMP.Three
                : PROMPT_PAGE_INPUT.CLAMP.TWO
              : ''
            : '',
          caretColor: editswitcher
            ? disableSingleClickFocus
              ? 'transparent'
              : 'auto'
            : 'auto',
          overflowWrap: 'break-word',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
        },
      }}
      value={value}
      {...props}
      {...handlers}
      InputProps={{
        readOnly: editswitcher && disableSingleClickFocus,
        onDoubleClick: () => {
          setDisableSingleClickFocus(false);
        },
      }}
    />
  );
};
