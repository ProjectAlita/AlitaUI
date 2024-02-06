import { CollectionStatus, ContentType, PUBLIC_PROJECT_ID, ViewMode } from '@/common/constants';
import { buildErrorMessage, sortByCreatedAt } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { Box } from '@mui/material';
import * as React from 'react';
import { useLazyTagListQuery } from '@/api/prompts';
import { useProjectId } from '@/pages/hooks';
import { useCollectionListQuery } from '@/api/collections';

export default function AllStuffList({ setTabCount }) {
  const {
    renderCard,
  } = useCardList(ViewMode.Moderator);

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
  const projectId = useProjectId();
  const [getTagList] = useLazyTagListQuery();
  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    if (collectionsData?.total <= collections.length) {
      return;
    }
    setCollectionPage(collectionPage + 1);
  }, [collectionPage, collections.length, collectionsData?.total]);

  const onLoadMore = React.useCallback(
    () => {
      if (!isCollectionFetching) {
        loadMoreCollections();
      }
    },
    [isCollectionFetching, loadMoreCollections],
  );

  const realDataList = React.useMemo(() => {
    const collectionList = collections.map((collection) => ({
      ...collection,
      cardType: ContentType.ModerationSpaceCollection,
    }));
    const finalList = [...collectionList].sort(sortByCreatedAt);
    return finalList;
  }, [collections]);

  React.useEffect(() => {
    if (collectionsData) {
      setTabCount(collectionsData?.total || 0)
    }
  }, [collectionsData, collectionsData?.total, setTabCount]);

  React.useEffect(() => {
    if (projectId) {
      getTagList({ projectId });
    }
  }, [getTagList, projectId]);

  return (
    <Box component='div'>
      <CardList
        cardList={realDataList}
        total={collectionsData?.total}
        isLoading={isCollectionsLoading}
        isError={isCollectionsError}
        renderCard={renderCard}
        isLoadingMore={isCollectionFetching}
        loadMoreFunc={onLoadMore}
        cardType={ContentType.ModerationSpacePrompt}
        dynamicTags
      />
      <Toast
        open={isCollectionsError && !!collectionPage}
        severity={'error'}
        message={buildErrorMessage(collectionError)}
      />
    </Box>
  );
}