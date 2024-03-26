import { PROMPT_PAGE_INPUT } from '@/common/constants.js';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Box, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useCallback, useState } from 'react';
import useAutoBlur from '@/components/useAutoBlur';

export const StyledInput = styled(TextField)(({ theme }) => ({
  padding: `8px 0 0 0`,
  '& .MuiFormLabel-root': {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 400,
    left: '12px',
  },
  '& .MuiInputLabel-shrink': {
    fontSize: '16px',
    lineHeight: '21px',
    fontWeight: 400,
    top: '8px',
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
    overflowY: 'scroll !important',
  },
  '& #prompt-desc': {
    overflowY: 'scroll !important',
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
  '& :not(.Mui-error).MuiInput-underline:before': {
    borderBottomColor: theme.palette.border.lines,
  },
  '& .MuiFormHelperText-root.Mui-error': {
    paddingLeft: '12px',
  }
}));

export const TabBarItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
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
  position: 'absolute',
  top: '0',
  right: '8px'
}));


export default function StyledInputEnhancer(props) {
  const {
    showexpandicon = false,
    editswitcher = false,
    editswitchconfig = {},
    onDrop,
    onDragOver,
    onBlur,
    onChange,
    onKeyPress,
    value,
    containerProps={},
    maxRows = null, 
    minRows = 3, 
    collapseContent = false, 
    ...leftProps
  } = props;
  const [rows, setRows] = useState(collapseContent ? minRows : maxRows);

  const switchRows = useCallback(() => {
    setRows((prev) => (prev === maxRows ? minRows : maxRows));
  }, [maxRows, minRows]);

  const autoBlur = useAutoBlur();

  const handlers = {
    onBlur: useCallback(
      (event) => {
        if (onBlur) {
          onBlur(event);
        }
      },
      [onBlur]
    ),
    onChange: useCallback((event) => {
      if (onChange)
        onChange(event);
      autoBlur();
    }, [autoBlur, onChange]),
    onDrop: useCallback(
      (event) => {
        event.preventDefault();
        if (onDrop)
          onDrop(event);
      },
      [onDrop]
    ),
    onDragOver: useCallback(
      (event) => {
        event.preventDefault();
        if (onDragOver)
          onDragOver(event);
      },
      [onDragOver]
    ),
    onKeyPress: useCallback((event) => {
      if (onKeyPress)
        onKeyPress(event);
    }, [onKeyPress]),
  };
  
  return (
    <Box position='relative' marginBottom='8px' {...containerProps}>
      <StyledInput
        variant='standard'
        fullWidth
        sx={{
          '.MuiInputBase-input': {
            maxHeight: editswitcher
              ? editswitchconfig.inputHeight || PROMPT_PAGE_INPUT.ROWS.TWO
              : '100%',
            WebkitLineClamp: editswitcher
              ? editswitchconfig.inputHeight === PROMPT_PAGE_INPUT.ROWS.Three
                ? PROMPT_PAGE_INPUT.CLAMP.Three
                : PROMPT_PAGE_INPUT.CLAMP.TWO
              : '',
            caretColor: editswitcher
              ? 'transparent'
              : 'auto',
            overflowWrap: 'break-word',
            textOverflow: 'ellipsis',
            overflow: 'scroll',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
          },
        }}
        value={value}
        {...leftProps}
        {...handlers}
        InputProps={{
          readOnly: editswitcher,
          onDoubleClick: () => {
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
    </Box>
  );
}
