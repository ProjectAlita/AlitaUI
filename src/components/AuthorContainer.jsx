import CardPopover from '@/components/CardPopover';
import UserAvatar from '@/components/UserAvatar';
import { useCallback, useRef } from 'react';
import { useNavigateToAuthorPublicPage } from './useCardNavigate';

const MAX_NUMBER_AVATARS_SHOWN = 3;
const MAX_NUMBER_NAME_SHOWN = 1;
const StyledExtraAvatarCountsContainer = styled('div')(({ theme }) => ({
  caretColor: 'transparent',
  width: '28px',
  height: '28px',
  lineHeight: '28px',
  margin: '0 auto',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

const StyledAuthorNameContainer = styled('div')(({ theme }) => ({
  caretColor: 'transparent',
  marginLeft: '5px',
  wordWrap: 'break-word',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '1',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

const StyledExtraNameCountsContainer = styled('div')(({ theme }) => ({
  caretColor: 'transparent',
  marginLeft: '0.5rem',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

export default function AuthorContainer({ authors = [] }) {
  const avatarsContainerStyle = {
    fontFamily: 'Montserrat',
    width: '180px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    lineHeight: '16px',
  };

  const textStyle = {
    marginLeft: '5px',
    wordWrap: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '1',
  };
  const firstThreeAvatars = authors.slice(0, MAX_NUMBER_AVATARS_SHOWN);
  const extraAvatarCounts = authors.length - MAX_NUMBER_AVATARS_SHOWN;
  const extraNameCounts = authors.length - MAX_NUMBER_NAME_SHOWN;
  const cardPopoverRef = useRef(null);
  const handleAuthorNumberClick = useCallback((event) => {
    cardPopoverRef.current.handleClick(event);
  }, []);
  const { navigateToAuthorPublicPage } = useNavigateToAuthorPublicPage();

  return (
    <div style={avatarsContainerStyle}>
      {firstThreeAvatars.map(({ id, name, avatar }, index) => (
        <UserAvatar key={id} name={name} avatar={avatar} shiftPixels={index * 3} />
      ))}
      {extraAvatarCounts > 0 ? (
        <StyledExtraAvatarCountsContainer>
          +{extraAvatarCounts}
        </StyledExtraAvatarCountsContainer>
      ) : null}
      <StyledAuthorNameContainer style={textStyle} onClick={navigateToAuthorPublicPage(authors[0]?.id, authors[0]?.name)}>
        <div>{authors[0]?.name}</div>
      </StyledAuthorNameContainer>
      <StyledExtraNameCountsContainer onClick={handleAuthorNumberClick}>
        {extraNameCounts > 0 ? `+${extraNameCounts}` : null}
      </StyledExtraNameCountsContainer>
      <CardPopover ref={cardPopoverRef} contentList={authors} type={'author'} />
    </div>
  );
}
