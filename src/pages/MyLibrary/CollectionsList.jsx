import { useCollectionListQuery } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { useCollectionProjectId, useViewModeFromUrl } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';

const CollectionsList = ({
  rightPanelOffset,
}) => {
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const collectionProjectId = useCollectionProjectId();
  const [page, setPage] = React.useState(0);
  const {error,
    data: collectionsData, 
    isError: isCollectionsError, 
    isLoading: isCollectionsLoading
  } = useCollectionListQuery({ 
    projectId: collectionProjectId,
    page 
  }, { 
    skip: !collectionProjectId 
  });
  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    setPage(page + 1);
  }, [page]);

  return (
    <>
      <CardList
        cardList={collections}
        isLoading={isCollectionsLoading}
        isError={isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.MyLibraryCollections}
      />
      <Toast
        open={false}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default CollectionsList;
