import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { ContentType, PUBLIC_PROJECT_ID, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { Box } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';

export default function RequestToPublish ({tabIndex, setTabCount}) {
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(ViewMode.Moderator);

  const { tagList } = useSelector((state) => state.prompts);
  const { calculateTagsWidthOnCard } = useTags(tagList);
  const [loadPrompts, { data, isError, isLoading, isFetching: isFirstFetching }] = useLazyPromptListQuery();
  const [loadMore, {
    isError: isMoreError,
    isFetching,
    error
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};
  
  const { filteredList } = useSelector((state) => state.prompts);
  const [offset, setOffset] = React.useState(0);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadMore({
      projectId: PUBLIC_PROJECT_ID,
      params: {
        limit: PAGE_SIZE,
        offset: newOffset,
        tags: [],
        sort_by: 'created_at',
        sort_order: 'desc',
        statuses: PromptStatus.OnModeration
      }
    })
  }, [total, filteredList.length, offset, PAGE_SIZE, loadMore]);
  
  React.useEffect(() => {
    loadPrompts({
      projectId: PUBLIC_PROJECT_ID,
      params: {
        limit: PAGE_SIZE,
        offset: 0,
        tags: [],
        sort_by: 'created_at',
        sort_order: 'desc',
        statuses: PromptStatus.OnModeration
      }
    });
    setOffset(0);
  }, [PAGE_SIZE, loadPrompts]);
  
  React.useEffect(() => {
    if(data){
      setTabCount(data?.rows?.length || 0, tabIndex);
      calculateTagsWidthOnCard();
    }
  }, [calculateTagsWidthOnCard, data, setTabCount, tabIndex])

  if (isError) return <>error</>;

  return (
    <Box component='div'>
      <CardList
        cardList={filteredList}
        isLoading={isLoading || isFirstFetching}
        isError={isError}
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={loadMorePrompts}
        cardType={ContentType.ModerationSpacePrompt}
        />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </Box>
  );
}