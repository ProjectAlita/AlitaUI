import { Box, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';

import { ContentType, ViewMode } from '@/common/constants';
import { filterProps } from '@/common/utils';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import StarActiveIcon from './Icons/StarActiveIcon';
import StarIcon from './Icons/StarIcon';
import useLikePromptCard, { isPromptCard, useLikeCollectionCard } from './useCardLike';

export const StyledItemPair = styled(Box, filterProps('disabled'))(({ theme, disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 8px',
  width: '52px',
  borderRadius: '0.5rem',
  caretColor: 'transparent',
  cursor: disabled ? 'default' : 'pointer',
  '&:hover': {
    background: disabled ? 'transparent' : theme.palette.background.icon.default,
  },
}));

export default function Like({
  viewMode, type = ContentType.MyLibraryPrompts, data
}) {
  const { id, likes = 0, is_liked = false, } = data;
  const { handleLikePromptClick, isLoading: isLoadingLikePrompt } = useLikePromptCard(id, is_liked, type, viewMode);
  const { handleLikeCollectionClick, isLoading: isLoadingLikeCollection } = useLikeCollectionCard(id, is_liked, viewMode);
  const handleLikeClick = useCallback(
    () => {
      if (isPromptCard(type)) {
        handleLikePromptClick();
      } else {
        handleLikeCollectionClick();
      }
    },
    [handleLikeCollectionClick, handleLikePromptClick, type],
  )

  const isLoading = useMemo(() => isLoadingLikePrompt || isLoadingLikeCollection, [isLoadingLikeCollection, isLoadingLikePrompt]);

  return (
    <StyledItemPair disabled={viewMode !== ViewMode.Public || isLoading} onClick={handleLikeClick}>
      {is_liked ? <StarActiveIcon /> : <StarIcon />}
      <Typography variant='bodySmall' component='div'>{likes || 0}</Typography>
      {isLoading && <StyledCircleProgress size={20} />}
    </StyledItemPair>
  );
}