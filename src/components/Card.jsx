import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { CardContent, Card as MuiCard, Typography, Box, Avatar } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ContentType, ViewMode } from '@/common/constants';
import { getStatusColor } from '@/common/utils';
import CardPopover from '@/components/CardPopover';
import { useDataViewMode } from '@/pages/hooks';
import AuthorContainer from './AuthorContainer';
import HighlightQuery from './HighlightQuery';
import BookmarkIcon from './Icons/BookmarkIcon';
import CommentIcon from './Icons/CommentIcon';
import ConsoleIcon from './Icons/ConsoleIcon';
import DatabaseIcon from './Icons/DatabaseIcon';
import FolderIcon from './Icons/FolderIcon';
import TrophyIcon from './Icons/TrophyIcon';
import Like, { StyledItemPair } from './Like';
import { isCollectionCard, isDataSourceCard, isPromptCard, isApplicationCard } from './useCardLike';
import useCardNavigate from './useCardNavigate';
import useCardResize from './useCardResize';
import useTags from './useTags';
import VectorIcon from './Icons/VectorIcon';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { useTheme } from '@emotion/react';

const MOCK_ISTOP = false;
const MOCK_INFO = false;

const MOCK_COMMENT_COUNT = 10;

const DOUBLE_LINE_HIGHT = 48;
const MAX_NUMBER_TAGS_SHOWN = 3;

const StyledCard = styled(MuiCard)(({ theme }) => ({
  width: '315.33px',
  height: '192px',
  margin: '10px 22px',
  background: theme.palette.background.secondary,
}));

export const StyledConsoleIcon = styled(ConsoleIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

export const StyledDataSourceIcon = styled(DatabaseIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

export const StyledFolderIcon = styled(FolderIcon)(() => ({
  width: '1rem',
  height: '1rem',
  transform: 'translate(4px, 4px)',
}));

export const StyledVectorIcon = styled(VectorIcon)(() => ({
  width: '13px',
  height: '13px',
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

const StyledInfoContainer = styled('div')(() => ({
  fontFamily: 'Montserrat',
  display: 'flex',
  minWidth: '52px',
  height: '28px',
  '& .icon-size': {
    width: '16px',
    height: '16px',
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
        <StyledSpan paddingLeft={paddingLeft ? '0.5rem' : '0'} translateY={icon ? 'translateY(-2px)' : ''}>
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

const PromptOrDataSourceMidSection = ({
  tags,
  allTags,
  extraTagsCount,
  disableClickTags = false,
  dynamic = false,
  type,
}) => {
  const tagLength = useMemo(() => tags?.length, [tags]);
  const cardPopoverRef = useRef(null);
  const { handleClickTag } = useTags();

  const handleTagClick = useCallback((tag) => (e) => {
    handleClickTag(e, tag)
  }, [handleClickTag])

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
        text={isPromptCard(type) ?
          <StyledConsoleIcon /> :
          isDataSourceCard(type) ? <StyledDataSourceIcon /> :
            <StyledVectorIcon />}
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
            onClick={disableClickTags ? null : handleTagClick(tag)}
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
        icon={true}
      />
      <MidSelectionItem
        text={promptCount}
        noDivider={true}
        paddingLeft={false}
      />
    </StyledCardMidSection>
  );
};

const InfoContainer = ({ viewMode, type = ContentType.MyLibraryPrompts, data }) => {
  const { id, name } = data;
  const doNavigateWithAnchor = useCardNavigate({
    anchor: '#comments',
    viewMode,
    id,
    type,
    name
  });

  return (
    <>
      {viewMode !== ViewMode.Owner && <StyledInfoContainer disabled={viewMode !== ViewMode.Public}>
        <Like viewMode={viewMode} type={type} data={data} />
        {MOCK_INFO && <StyledItemPair onClick={doNavigateWithAnchor}>
          <CommentIcon className={'icon-size'} />
          <Typography variant='bodySmall' component='div'>{MOCK_COMMENT_COUNT}</Typography>
        </StyledItemPair>}
      </StyledInfoContainer>}
      {isCollectionCard(type) && MOCK_INFO && (
        <StyledInfoContainer>
          <StyledItemPair>
            <BookmarkIcon className={'icon-size'} />
            <Typography variant='bodySmall' component='div'>{MOCK_COMMENT_COUNT}</Typography>
          </StyledItemPair>
        </StyledInfoContainer>
      )}
    </>
  );
};

export default function Card({
  data = {},
  viewMode: pageViewMode,
  collectionName,
  type,
  index = 0,
  dynamic = true,
}) {
  const {
    id,
    owner_id: ownerId,
    name = '',
    description = '',
    authors = [],
    author = {},
    status,
  } = data;
  const theme = useTheme();
  const viewMode = useDataViewMode(pageViewMode, data);
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

  const doNavigate = useCardNavigate({ viewMode, id, ownerId, type, name, collectionName });

  return (
    <div style={{ width: '100%' }} ref={cardRef}>
      <StyledCard sx={{ minWidth: 275, display: 'inline' }}>
        <StyledCarContent>
          {viewMode === ViewMode.Owner && (
            <StyledStatusIndicator status={status} />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'row', marginLeft: isApplicationCard(type) ? '16px' : '0px'}}>
            {
              isApplicationCard(type) &&
              <Avatar sx={{ width: 32, height: 32, marginTop: '8px' }}>
                <PhotoSizeSelectActualOutlinedIcon sx={{ color: theme.palette.icon.fill.default }} />
              </Avatar>
            }
            <StyledCardTopSection onClick={doNavigate}>
              <StyledCardTitle
                ref={cardTitleRef}
                sx={{ fontSize: 14 }}
                color='text.secondary'
                gutterBottom
              >
                <HighlightQuery text={name} />
              </StyledCardTitle>
              <StyledCardDescription
                sx={{ mb: 1.5 }}
                color='text.secondary'
                style={{ WebkitLineClamp: lineClamp, marginTop: '0.25rem' }}
              >
                <HighlightQuery text={description} />
              </StyledCardDescription>
            </StyledCardTopSection>
          </Box>
          {isPromptCard(type) && (
            <PromptOrDataSourceMidSection
              tags={processedTags}
              allTags={data.tags}
              extraTagsCount={extraTagsCount}
              disableClickTags={type === ContentType.ModerationSpacePrompt}
              dynamic={dynamic}
              type={type}
            />
          )}
          {isDataSourceCard(type) && (
            <PromptOrDataSourceMidSection
              tags={processedTags}
              allTags={data.tags}
              extraTagsCount={extraTagsCount}
              disableClickTags={type === ContentType.ModerationSpaceDatasource}
              dynamic={dynamic}
              type={type}
            />
          )}
          {isCollectionCard(type)
            && (
              <CollectionMidSection data={data} />
            )}
          {isApplicationCard(type) && <PromptOrDataSourceMidSection
            tags={processedTags}
            allTags={data.tags}
            extraTagsCount={extraTagsCount}
            disableClickTags={type === ContentType.ModerationSpaceApplication}
            dynamic={dynamic}
            type={type}
          />
          }
          <StyledCardBottomSection color='text.secondary'>
            <AuthorContainer
              authors={isCollectionCard(type) ? [author] : authors}
            />
            <InfoContainer
              viewMode={pageViewMode}
              type={type}
              data={data}
            />
          </StyledCardBottomSection>
        </StyledCarContent>
      </StyledCard>
    </div>
  );
}
