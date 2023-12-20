import { ContentType, ViewMode } from '@/common/constants';
import { getStatusColor } from '@/common/utils';
import UserAvatar from '@/components/UserAvatar';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import CommentIcon from './Icons/CommentIcon';
import ConsoleIcon from './Icons/ConsoleIcon';
import FolderIcon from './Icons/FolderIcon';
import StarActiveIcon from './Icons/StarActiveIcon';
import StarIcon from './Icons/StarIcon';
import TrophyIcon from './Icons/TrophyIcon';
import BookmarkIcon from './Icons/BookmarkIcon';
import CardPopover from '@/components/CardPopover';
import useTags from './useTags';
import useCardNavigate from './useCardNavigate';
import useCardResize from './useCardResize';

const MOCK_ISTOP = false;
const MOCK_INFO = false;

const MOCK_FAVORITE_COUNT = 20;
const MOCK_COMMENT_COUNT = 10;

const DOUBLE_LINE_HIGHT = 48;
const MAX_NUMBER_TAGS_SHOWN = 3;
const MAX_NUMBER_AVATARS_SHOWN = 3;
const MAX_NUMBER_NAME_SHOWN = 1;

const StyledCard = styled(MuiCard)(({ theme }) => ({
  width: '315.33px',
  height: '192px',
  margin: '10px 22px',
  background: theme.palette.background.secondary,
}));

const StyledConsoleIcon = styled(ConsoleIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

const StyledFolderIcon = styled(FolderIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

const StyledCarContent = styled(CardContent)(() => ({
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
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
  padding: '0 1rem 0 0.75rem',
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

const StyledMidSelectionItem = styled('span')(({ theme, hoverHighlight }) => {
  return {
    textWrap: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Montserrat',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: '400',
    color: theme?.palette?.text?.primary,
    height: '28px',
    '&:hover': {
      color: hoverHighlight ? theme?.palette?.text?.secondary : null,
    },
  };
});

const MidSelectionItemDivider = styled('div')(({ theme }) => {
  return {
    width: '0.0625rem',
    height: '0.9375rem',
    border: `1px solid ${theme.palette.border.lines}`,
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
  };
});

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

const StyledExtraNameCountsContainer = styled('div')(({ theme }) => ({
  caretColor: 'transparent',
  marginLeft: '0.5rem',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

const StyledInfoContainer = styled('div')(({ theme }) => ({
  fontFamily: 'Montserrat',
  display: 'flex',
  minWidth: '52px',
  height: '28px',
  '& .item-pair': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '52px',
    padding: '6px 8px 6px 8px',
    borderRadius: '0.5rem',
    caretColor: 'transparent',
    cursor: 'pointer',
  },
  '& .icon-size': {
    width: '16px',
    height: '16px',
  },
  '& .icon-font': {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '400',
  },
  '& .item-pair:hover': {
    background: theme.palette.background.icon.default,
  },
}));

const StyledExtraTagCountsContainer = styled('span')(({ theme }) => ({
  '& span:hover': {
    color: theme.palette.text.secondary,
  },
}));

const StyledStatusIndicator = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop),
})(
  ({ status, theme }) => `
  width: 0.1875rem;
  height: 1rem;
  position: absolute;
  left: 0.0625rem;
  top: 0.75rem;
  border-radius: 0.25rem;
  background: ${getStatusColor(status, theme)};
`
);

const StyledSpan = styled('span')(({ paddingLeft, translateY }) => ({
  transform: translateY,
  paddingLeft,
  paddingRight: '0.5rem',
}));

const isPromptCard = (type) =>
  type === ContentType.MyLibraryAll ||
  type === ContentType.MyLibraryPrompts ||
  type === ContentType.PromptsTop ||
  type === ContentType.PromptsLatest ||
  type === ContentType.PromptsMyLiked ||
  type === ContentType.MyLibraryCollectionPrompts;

const isCollectionCard = (type) =>
  type === ContentType.MyLibraryCollections ||
  type === ContentType.CollectionsTop ||
  type === ContentType.CollectionsLatest ||
  type === ContentType.CollectionsMyLiked;

export const MidSelectionItem = ({
  text,
  noDivider = true,
  paddingLeft = true,
  onClick,
  hoverHighlight,
  icon = false,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'auto',
        caretColor: 'transparent',
      }}
    >
      <StyledMidSelectionItem hoverHighlight={hoverHighlight}>
        <StyledSpan paddingLeft={paddingLeft ? '0.5rem' : '0'} translateY={icon ? 'translateY(-0.1rem)' : ''}>
          {text}
        </StyledSpan>
        {noDivider ? '' : <MidSelectionItemDivider />}
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

const PromptMidSection = ({ tags, allTags, extraTagsCount, dynamic = false }) => {
  const tagLength = useMemo(() => tags?.length, [tags]);
  const cardPopoverRef = useRef(null);
  const { handleClickTag } = useTags();

  const handleTagNumberClick = useCallback(
    (event) => {
      cardPopoverRef.current.handleClick(event);
    },
    [cardPopoverRef]
  );

  return (
    <StyledCardMidSection color='text.secondary'>
      <MidSelectionItem
        noDivider={!tagLength}
        paddingLeft={false}
        text={<StyledConsoleIcon />}
        icon
      />
      {tags?.map((tag, index) => {
        if (!dynamic && (index > MAX_NUMBER_TAGS_SHOWN - 1)) return;
        const tagName = tag?.name;
        const tagId = tag?.id;
        return (
          <MidSelectionItem
            key={tagId}
            text={tagName}
            hoverHighlight
            noDivider={
              index === tagLength - 1 || (!dynamic && index === MAX_NUMBER_TAGS_SHOWN - 1)
            }
            onClick={handleClickTag}
          />
        );
      })}
      {
        (!dynamic && tagLength - MAX_NUMBER_TAGS_SHOWN > 0) ? (
          <StyledExtraTagCountsContainer>
            <MidSelectionItem text={`+${tagLength - MAX_NUMBER_TAGS_SHOWN}`} noDivider={true} onClick={handleTagNumberClick} />
          </StyledExtraTagCountsContainer>
        ) : null
      }
      {
        dynamic && extraTagsCount ? (
          <StyledExtraTagCountsContainer>
            <MidSelectionItem
              text={`+${extraTagsCount}`}
              noDivider={true}
              onClick={handleTagNumberClick}
            />
          </StyledExtraTagCountsContainer>
        ) : null
      }
      <CardPopover ref={cardPopoverRef} contentList={allTags} type={'category'} />
      <MidSelectionItemLabel isTop={MOCK_ISTOP} />
    </StyledCardMidSection>
  );
};

const CollectionMidSection = ({ data = {} }) => {
  const { prompt_count: promptCount } = data;
  return (
    <StyledCardMidSection color='text.secondary'>
      <MidSelectionItem
        text={<StyledFolderIcon />}
        noDivider={true}
        paddingLeft={false}
      />
      <MidSelectionItem
        text={promptCount}
        noDivider={true}
        paddingLeft={false}
      />
    </StyledCardMidSection>
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
      <StyledAuthorNameContainer style={textStyle}>
        <div>{authors[0]?.name}</div>
      </StyledAuthorNameContainer>
      <StyledExtraNameCountsContainer onClick={handleAuthorNumberClick}>
        {extraNameCounts > 0 ? `+${extraNameCounts}` : null}
      </StyledExtraNameCountsContainer>
      <CardPopover ref={cardPopoverRef} contentList={authors} type={'author'} />
    </div>
  );
};

const InfoContainer = ({ viewMode, type = ContentType.MyLibraryPrompts, id, name }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(MOCK_FAVORITE_COUNT);
  const doNavigateWithAnchor = useCardNavigate({
    hashAnchor: '#comments',
    viewMode,
    id,
    type,
    name
  });

  const handleLikeClick = useCallback(() => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  }, [liked]);
  return (
    <>
      {isPromptCard(type) && (
        <StyledInfoContainer>
          <div className={'item-pair'} onClick={handleLikeClick}>
            {liked ? (
              <StarActiveIcon className={'icon-size'} />
            ) : (
              <StarIcon className={'icon-size'} />
            )}
            <div className={'icon-font'}>{likes}</div>
          </div>
          <div className={'item-pair'} onClick={doNavigateWithAnchor}>
            <CommentIcon className={'icon-size'} />
            <div className={'icon-font'}>{MOCK_COMMENT_COUNT}</div>
          </div>
        </StyledInfoContainer>
      )}
      {isCollectionCard(type) && (
        <StyledInfoContainer>
          <div className={'item-pair'}>
            <BookmarkIcon className={'icon-size'} />
            <div className={'icon-font'}>{MOCK_COMMENT_COUNT}</div>
          </div>
        </StyledInfoContainer>
      )}
    </>
  );
};

export default function Card({
  data = {},
  viewMode = ViewMode.Public,
  collectionName,
  type,
  index = 0,
}) {
  const {
    id,
    name = '',
    description = '',
    authors = [],
    author = {},
    status,
  } = data;
  const initialCardDescriptionHeight = 2;
  const [lineClamp, setLineClamp] = useState(initialCardDescriptionHeight);
  const cardTitleRef = useRef(null);
  const cardRef = useRef(null);

  const isTitleSingleRow = () => {
    return cardTitleRef.current.offsetHeight < DOUBLE_LINE_HIGHT;
  };
  useEffect(() => {
    const cardDescriptionHeight = isTitleSingleRow() ? 3 : 2;
    setLineClamp(cardDescriptionHeight);
  }, []);

  const { processTagsByCurrentCardWidth } = useCardResize(cardRef, index);
  const { processedTags, extraTagsCount } = processTagsByCurrentCardWidth(
    data.tags
  );

  const doNavigate = useCardNavigate({ viewMode, id, type, name, collectionName });

  return (
    <div style={{ width: '100%' }} ref={cardRef}>
      <StyledCard sx={{ minWidth: 275, display: 'inline' }}>
        <StyledCarContent>
          {viewMode === ViewMode.Owner && (
            <StyledStatusIndicator status={status} />
          )}
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
          {isPromptCard(type) && (
            <PromptMidSection
              tags={processedTags}
              allTags={data.tags}
              extraTagsCount={extraTagsCount}
              dynamic
            />
          )}
          {isCollectionCard(type)
            && (
              <CollectionMidSection data={data} />
            )}
          <StyledCardBottomSection color='text.secondary'>
            <AuthorContainer
              authors={isCollectionCard(type) ? [author] : authors}
            />
            {MOCK_INFO && <InfoContainer
              viewMode={viewMode}
              type={type}
              id={id}
              name={name}
            />}
          </StyledCardBottomSection>
        </StyledCarContent>
      </StyledCard>
    </div>
  );
}
