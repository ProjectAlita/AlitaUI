import { CollectionStatus, ContentType, PUBLIC_PROJECT_ID, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage, sortByCreatedAt } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { Box } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLazyTagListQuery, usePromptListQuery } from '@/api/prompts';
import { useProjectId } from '@/pages/hooks';
import { useCollectionListQuery } from '@/api/collections';

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

  const [collectionPage, setCollectionPage] = React.useState(0);
  const { error: collectionError,
    data: collectionsData,
    isError: isCollectionsError,
    isLoading: isCollectionsLoading,
    isFetching: isCollectionFetching,
  } = useCollectionListQuery({
    projectId: PUBLIC_PROJECT_ID,
    page: collectionPage,
    params: {
      tags: [],
      sort_by: 'created_at',
      sort_order: 'desc',
      statuses: CollectionStatus.OnModeration
    }
  });
  const { total } = data || {};
  const { filteredList } = useSelector((state) => state.prompts);
  const projectId = useProjectId();
  const [getTagList] = useLazyTagListQuery();
  const { rows: collections = [] } = collectionsData || {};
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) {
      return;
    }
    setPage(page + 1);
  }, [total, filteredList.length, page]);

  const loadMoreCollections = React.useCallback(() => {
    if (collectionsData?.total <= collections.length) {
      return;
    }
    setCollectionPage(collectionPage + 1);
  }, [collectionPage, collections.length, collectionsData?.total]);

  const onLoadMore = React.useCallback(
    () => {
      if (!isFetching && !isCollectionFetching) {
        loadMorePrompts();
        loadMoreCollections();
      }
    },
    [isCollectionFetching, isFetching, loadMoreCollections, loadMorePrompts],
  );

  const realDataList = React.useMemo(() => {
    const prompts = filteredList.map((prompt) => ({
      ...prompt,
      cardType: ContentType.ModerationSpacePrompt,
    }));
    const collectionList = collections.map((collection) => ({
      ...collection,
      cardType: ContentType.ModerationSpaceCollection,
    }));
    const finalList = [...prompts, ...collectionList].sort(sortByCreatedAt);
    return finalList;
  }, [collections, filteredList]);

  React.useEffect(() => {
    if (data) {
      setTabCount((data?.total || 0) + (collectionsData?.total || 0));
    }
  }, [collectionsData?.total, data, setTabCount]);

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
        total={(data?.total || 0) + (collectionsData?.total || 0)}
        isLoading={isLoading || isCollectionsLoading}
        isError={isError}
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={onLoadMore}
        cardType={ContentType.ModerationSpacePrompt}
        dynamicTags
      />
      <Toast
        open={(isError && !!page) || (isCollectionsError && !!collectionPage)}
        severity={'error'}
        message={buildErrorMessage(error || collectionError)}
      />
    </Box>
  );
}