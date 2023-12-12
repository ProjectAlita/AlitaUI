import {
  PROMPT_MODE,
  PROMPT_PAGE_INPUT,
  PROMPT_PAYLOAD_KEY,
  VariableSources,
} from '@/common/constants.js';
import Button from '@/components/Button';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Avatar, Box, Grid, Skeleton, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUpdateCurrentPrompt, useUpdateVariableList } from './hooks';

export const LeftContentContainer = styled(Box)(() => ({
  overflowY: 'scroll',
  height: 'calc(100vh - 11.7rem)',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  }
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    overflowY: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    height: 'calc(100vh - 11.7rem)',
    '::-webkit-scrollbar': {
      display: 'none',
    }
  }
}));

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down('lg')]: {
    overflowY: 'scroll',
    height: 'calc(100vh - 8.6rem)',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

export const VersionSelectContainer = styled('div')(() => ({
  display: 'inline-block',
  marginRight: '2rem',
  minWidth: '4rem',
  paddingTop: '0.16rem',
}));

export const LeftGridItem = styled(Grid)(() => ({
  position: 'relative',
  padding: '0 0.75rem 0 0',
}));

export const RightGridItem = styled(Grid)(() => ({
  padding: '0 0.75rem 0 0',
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  padding: `8px 0 0 0`,
  '& .MuiFormLabel-root': {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 400,
    left: '12px',
  },
  '& .MuiInputLabel-shrink': {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    top: '12px',
  },
  '& .MuiInputBase-root': {
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& textarea::-webkit-scrollbar': {
    display: 'none'
  },
  '& #prompt-context': {
    overflowY: 'scroll',
  },
  '& label': {
    color: theme.palette.text.primary
  },
  '& input': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    height: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& textarea': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& .MuiInput-underline': {
    padding: '0 12px'
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.border.lines,
  },
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
  display: 'flex',
  flexDirection: 'reverse-row',
}));

export const VersionContainer = styled(Box)(() => (`
  box-sizing: border-box;
  height: 100%;
  padding-top: 0.16rem;
`));

export const SelectLabel = styled(Typography)(() => ({
  display: 'inline-block',
}));

export const StyledUnfoldLessIcon = styled(UnfoldLessIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const StyledUnfoldMoreIcon = styled(UnfoldMoreIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const StyledIconButton = styled(IconButton)(() => ({
  zIndex: 100,
  marginRight: '-1.096rem',
}));


export const StyledInputEnhancer = (props) => {
  const {
    showexpandicon = false,
    editswitcher = false,
    editswitchconfig = {},
    payloadkey,
    label,
    onDrop,
    onDragOver,
    onBlur,
  } = props;
  const { defaultValue = '', maxRows = null, minRows = 3, ...leftProps } = props;
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [updateVariableList] = useUpdateVariableList(VariableSources.Context);
  const [updateCurrentPrompt] = useUpdateCurrentPrompt();
  const [rows, setRows] = useState(maxRows);
  const [mode, setMode] = useState(PROMPT_MODE.Edit);
  const [disableSingleClickFocus, setDisableSingleClickFocus] = useState(false);
  const { promptId } = useParams();

  const theValue = useMemo(() => {
    const originalValue = currentPrompt && currentPrompt[payloadkey];
    if (payloadkey !== PROMPT_PAYLOAD_KEY.variables) {
      return originalValue || defaultValue;
    } else {
      return originalValue.find((item) => item.key === label).value;
    }
  }, [currentPrompt, defaultValue, label, payloadkey]);

  const [value, setValue] = useState('');

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

  const switchRows = useCallback(() => {
    setRows((prev) => (prev === maxRows ? minRows : maxRows));
  }, [maxRows, minRows]);

  const handlers = {
    onBlur: useCallback(
      (event) => {
        if (onBlur) {
          onBlur(event);
        }
        setDisableSingleClickFocus(mode === PROMPT_MODE.View);
        if (payloadkey === PROMPT_PAYLOAD_KEY.variables) {
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
    onKeyPress: useCallback(() => {
      if (disableSingleClickFocus) {
        setDisableSingleClickFocus(false);
      }
      setMode(PROMPT_MODE.Edit);
    }, [disableSingleClickFocus]),
  };

  return (
    <div style={{ position: 'relative', marginBottom: '8px' }}>
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
              ? editswitchconfig.inputHeight === PROMPT_PAGE_INPUT.ROWS.Three
                ? PROMPT_PAGE_INPUT.CLAMP.Three
                : PROMPT_PAGE_INPUT.CLAMP.TWO
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
        {...leftProps}
        {...handlers}
        InputProps={{
          readOnly: editswitcher && disableSingleClickFocus,
          onDoubleClick: () => {
            setDisableSingleClickFocus(false);
          },
          endAdornment: showexpandicon ? (
            <StyledIconButton
              size='small'
              onClick={switchRows}
            >
              {rows === maxRows ? (
                <StyledUnfoldLessIcon />
              ) : (
                <StyledUnfoldMoreIcon />
              )}
            </StyledIconButton>
          ) : null
        }}
        maxRows={rows}
      />
    </div>
  );
};


export const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.button.secondary,
  '&.Mui-disabled': {
    backgroundColor: theme.palette.text.primary,
  },
  '&:hover': {
    background: theme.palette.primary.main,
  }
}));

export const NormalRoundButton = styled(Button)(({ theme }) => ({
  background: theme.palette.background.button.normal,
  '&.Mui-disabled': {
    background: theme.palette.background.button.normal,
    color: theme.palette.text.button.disabled,
  },
  '&:hover': {
    background: theme.palette.background.button.secondary.hover,
  }
}));


export const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export const PromptDetailSkeleton = () => (<Grid container spacing={2}>
  <Grid item xs={6}>
    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={700} />
  </Grid>
  <Grid item xs={6}>
    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={700} />
  </Grid>
</Grid>);