import styled from '@emotion/styled';
import { getInitials, stringToColor } from '@/common/utils'
import { Avatar } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommentIcon from './Icons/CommentIcon';
import StarIcon from './Icons/StarIcon';
import TrophyIcon from './Icons/TrophyIcon';
import ConsoleIcon from './Icons/ConsoleIcon';

const MOCK_ISTOP = true;
const MOCK_FAVORITE_COUNT = 20;
const MOCK_COMMENT_COUNT = 10;
const MOCK_AVATARS = [
  'https://i.pravatar.cc/300?a=1',
  'https://i.pravatar.cc/300?a=2',
  'https://i.pravatar.cc/300?a=3',
  'https://i.pravatar.cc/300?a=4',
  'https://i.pravatar.cc/300?a=5',
];

const DOUBLE_LINE_HIGHT = 48;

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white',
      fontSize: '0.6rem'
    },
    children: `${getInitials(name)}`,
  };
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: '315.33px',
  height: '192px',
  margin: '10px 22px',
  background: theme.palette.background.secondaryBg,
}));

const StyledConsoleIcon = styled(ConsoleIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)'
}));

const StyledCarContent = styled(CardContent)(() => ({
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardTopSection = styled('div')(() => ({
  height: '96px',
  padding: '0.5rem 1rem 0rem 1rem',
  marginBottom: '8px',
  cursor: 'pointer',
}));

const StyledCardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: 'Montserrat',
  fontSize: '0.875rem',
  lineHeight: '1.5rem',
  fontWeight: '600',
  maxHeight: '48px',
  marginBottom: '0',
  wordWrap: 'break-word',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '2',
}));

const StyledCardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: 'Montserrat',
  fontSize: '0.75rem',
  lineHeight: '16px',
  fontWeight: '400',
  maxHeight: '60px',
  marginBottom: '0',
  wordWrap: 'break-word',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
}));

const StyledCardMidSection = styled('div')(() => ({
  display: 'flex',
  height: '28px',
  marginBottom: '8px',
  padding: '0 10px',
}));

const StyledCardBottomSection = styled('div')(({ theme }) => ({
  marginBottom: '-1.5rem',
  borderTop: `1px solid ${theme.palette.border.activeBG}`,
  height: '52px',
  padding: '0 10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledMidSelectionItem = styled('span')(({ theme }) => ({
  fontFamily: 'Montserrat',
  fontSize: '0.75rem',
  lineHeight: '1rem',
  fontWeight: '400',
  color: theme.palette.text.primary,
  width: '67px',
  height: '28px',
}));

const MidSelectionItem = ({ text, isCount = false, index = 0 }) => {
  return (
    <div>
      <StyledMidSelectionItem>
        {index !== 0 ? '\u00A0\u00A0\u00A0' : null}
        {text}
        {'\u00A0\u00A0\u00A0'} {isCount ? '' : '|'}
      </StyledMidSelectionItem>
    </div>
  );
};

const MidSelectionItemLabel = ({ isTop }) => {
  return (
    <div style={{ marginLeft: 'auto', display: isTop ? 'block' : 'none' }}>
      <TrophyIcon />
    </div>
  );
};

const AuthorContainer = ({ authors = [] }) => {
  const avatarsContainerStyle = {
    fontFamily: 'Montserrat',
    width: '180px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    lineHeight: '16px',
  };
  const avatarStyle = {
    padding: '0',
    width: '20px',
    height: '20px',
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
  const countStyle = {
    width: '28px',
    height: '28px',
    lineHeight: '28px',
    margin: '0 auto',
  };
  const firstThreeAvatars = authors.slice(0, 3);
  const extraAvatarCounts = authors.length - 3;
  const extraNameCounts = authors.length - 1;
  return (
    <div style={avatarsContainerStyle}>
      {firstThreeAvatars.map(({ id, name, avatar }, index) => {
        if(!avatar) {
          return (
            <Avatar
              key={id}
              style={{ ...avatarStyle, transform: `translateX(-${index * 3}px)` }}
              {...stringAvatar(name)}
            />
          );
        }
        return (
          <Avatar
            key={id}
            style={{ ...avatarStyle, transform: `translateX(-${index * 3}px)` }}
            src={MOCK_AVATARS[Math.floor(Math.random() * 5)]}
          />
        );
      })}
      <div style={textStyle}>
        <div>{authors[0].name}</div>
      </div>
      <div style={{ marginLeft: '0.5rem' }}>
        {extraNameCounts > 0 ? `+${extraNameCounts}` : null}
      </div>
      {extraAvatarCounts > 0 ? (
        <div style={countStyle}>+{extraAvatarCounts}</div>
      ) : null}
    </div>
  );
};

const InfoContainer = () => {
  const containerStyle = {
    fontFamily: 'Montserrat',
    display: 'flex',
    width: '99px',
    height: '28px',
  };
  const itemPairStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '52px',
    padding: '6px 8px 6px 8px',
  };
  const iconSize = {
    width: '16px',
    height: '16px',
  };
  const fontStyle = {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '400',
  };
  return (
    <div style={containerStyle}>
      <div style={itemPairStyle}>
        <StarIcon style={iconSize} />
        <div style={fontStyle}>{MOCK_FAVORITE_COUNT}</div>
      </div>
      <div style={itemPairStyle}>
        <CommentIcon style={iconSize} />
        <div style={fontStyle}>{MOCK_COMMENT_COUNT}</div>
      </div>
    </div>
  );
};

export default function PromptCard({ data = {}, viewMode }) {
  const { id, name = '', description = '', authors = [], tags = [] } = data;
  const initialCardDescriptionHeight = 2;
  const [lineClamp, setLineClamp] = useState(initialCardDescriptionHeight);
  const { pathname } = useLocation();
  const cardTitleRef = useRef(null);
  const isTitleSingleRow = () => {
    return cardTitleRef.current.offsetHeight < DOUBLE_LINE_HIGHT;
  };
  useEffect(() => {
    const cardDescriptionHeight = isTitleSingleRow() ? 3 : 2;
    setLineClamp(cardDescriptionHeight);
  }, []);

  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    navigate(`/prompt/${id}`, {
      state: {
        from: pathname,
        breadCrumb: name,
        viewMode,
      },
    });
  }, [navigate, id, pathname, name, viewMode]);

  return (
    <div style={{ width: '100%' }}>
      <StyledCard sx={{ minWidth: 275, display: 'inline' }}>
        <StyledCarContent>
          <StyledCardTopSection onClick={doNavigate}>
            <StyledCardTitle
              ref={cardTitleRef}
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              {name}
            </StyledCardTitle>
            <StyledCardDescription
              sx={{ mb: 1.5 }}
              color='text.secondary'
              style={{ WebkitLineClamp: lineClamp, marginTop: '0.25rem' }}
            >
              {description}
            </StyledCardDescription>
          </StyledCardTopSection>
          <StyledCardMidSection color='text.secondary'>
          <MidSelectionItem isCount={!tags.length} text={<StyledConsoleIcon/>}/>
            {tags.map((tag, index) => {
              if (index > 2) return;
              const tagName = tag.name;
              const tagId = tag.id;
              return (
                <MidSelectionItem
                  key={tagId}
                  text={tagName}
                  isCount={index === tags.length - 1 || index === 2}
                  index={index + 1}
                />
              );
            })}
            {tags.length - 3 > 0 ? (
              <MidSelectionItem text={`+${tags.length - 3}`} isCount={true} />
            ) : null}
            <MidSelectionItemLabel isTop={MOCK_ISTOP} />
          </StyledCardMidSection>
          <StyledCardBottomSection color='text.secondary'>
            <AuthorContainer authors={authors} />
            <InfoContainer />
          </StyledCardBottomSection>
        </StyledCarContent>
      </StyledCard>
    </div>
  );
}
