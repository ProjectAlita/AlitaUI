import { ContentType, PUBLIC_PROJECT_ID, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage, sortByCreatedAt } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { Box } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLazyTagListQuery, usePromptListQuery } from '@/api/prompts';
import { useProjectId } from '@/pages/hooks';

export default function AllStuffList({ setTabCount }) {
  const {
    renderCard,
  } = useCardList(ViewMode.Moderator);
  const [page, setPage] = React.useState(0);
  const { data, error, isError, isLoading, isFetching } = usePromptListQuery({
    projectId: PUBLIC_PROJECT_ID,
    page,
    params: {
      tags: [],
      sort_by: 'created_at',
      sort_order: 'desc',
      statuses: PromptStatus.OnModeration
    }
  });

  const { total } = data || {};
  const { filteredList } = useSelector((state) => state.prompts);
  const projectId = useProjectId();
  const [getTagList] = useLazyTagListQuery();
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) {
      return;
    }
    setPage(page + 1);
  }, [total, filteredList.length, page]);

  const onLoadMore = React.useCallback(
    () => {
      if (!isFetching) {
        loadMorePrompts();
      }
    },
    [isFetching, loadMorePrompts],
  );

  const realDataList = React.useMemo(() => {
    const prompts = filteredList.map((prompt) => ({
      ...prompt,
      cardType: ContentType.ModerationSpacePrompt,
    }));
    const finalList = [...prompts].sort(sortByCreatedAt);
    return finalList;
  }, [filteredList]);

  React.useEffect(() => {
    if (data) {
      setTabCount(data?.total || 0);
    }
  }, [data, setTabCount]);

  React.useEffect(() => {
    if (projectId) {
      getTagList({ projectId });
    }
  }, [getTagList, projectId]);

  if (isError) return <>error</>;

  return (
    <Box component='div'>
      <CardList
        cardList={realDataList}
        total={total}
        isLoading={isLoading}
        isError={isError}
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={onLoadMore}
        cardType={ContentType.ModerationSpacePrompt}
        dynamicTags
      />
      <Toast
        open={(isError && !!page)}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </Box>
  );
}