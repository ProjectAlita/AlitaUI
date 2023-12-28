import { ContentType, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { Box } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { usePublicPromptListQuery } from '@/api/prompts';

export default function RequestToPublish({ setTabCount }) {
  const {
    renderCard,
  } = useCardList(ViewMode.Moderator);
  const [page, setPage] = React.useState(0);
  const { data, error, isError, isLoading, isFetching } = usePublicPromptListQuery({
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
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    setPage(page + 1);
  }, [total, filteredList.length, page]);

  React.useEffect(() => {
    if (data) {
      setTabCount(data?.total || 0);
    }
  }, [data, setTabCount]);

  if (isError) return <>error</>;

  return (
    <Box component='div'>
      <CardList
        cardList={filteredList}
        isLoading={isLoading}
        isError={isError}
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={loadMorePrompts}
        cardType={ContentType.ModerationSpacePrompt}
        dynamicTags={false}
      />
      <Toast
        open={isError && !!page}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </Box>
  );
}