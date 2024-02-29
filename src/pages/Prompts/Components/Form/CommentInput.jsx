import { useCallback, useRef } from 'react';
import { StyledInput } from '../Common';
import InputAdornment from '@mui/material/InputAdornment';
import { Avatar } from '@mui/material';
import EmojiIcon from '@/components/Icons/EmojiIcon';
import SendCommentIcon from '@/components/Icons/SendCommentIcon';

const CommentStyledInput = styled(StyledInput)(() => ({
  display: 'flex',
  gap: '0.5rem',
  width: '100%',
  '& > div': {
    height: '3rem',
  },
}));

const StyledIconContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.icon.default,
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  alignItems: 'center',
  padding: '0.375rem',
  gap: '0.25rem',
  marginLeft: '0.5rem',
  borderRadius: '1.75rem',
  cursor: 'pointer',
  '& > svg': {
    width: '1rem',
    height: '1rem',
  },
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  flex: '0 0 1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
}));

const placeholderStyle = {
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1.5rem',
};

const focusStyle = {
    disableUnderline: true,
    style: { '&:focus': { boxShadow: 'none' } }
}

const CommentInput = () => {
  const inputRef = useRef(null);
  const handleInputBlur = useCallback(() => {
    inputRef.current.style.caretColor = 'transparent'
  }, []);
  const handleInputFocus = useCallback(() => {
    inputRef.current.style.caretColor = 'auto'
  }, []);
  return (
    <CommentStyledInput
      inputRef={inputRef}
      onBlur={handleInputBlur}
      onFocus={handleInputFocus}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <StyledAvatar alt='Ford Jim' src='/static/images/avatar/1.jpg' />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position='start'>
            <StyledIconContainer>
              <EmojiIcon />
            </StyledIconContainer>
            <StyledIconContainer>
              <SendCommentIcon />
            </StyledIconContainer>
          </InputAdornment>
        ),
        style: {...placeholderStyle, ...focusStyle},
      }}
      placeholder={'What you think about it?'}
    />
  );
};

export default CommentInput;
