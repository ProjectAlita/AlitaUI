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
import AuthorInformation from '@/components/AuthorInformation';

const emptyListPlaceHolder = <div>You have not created collections yet. <br />Create yours now!</div>;

const CollectionsList = ({
  rightPanelOffset,
}) => {
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const collectionProjectId = useCollectionProjectId();
  const { name, avatar } = useSelector((state) => state.user);
  const [page, setPage] = React.useState(0);
  const { error,
    data: collectionsData,
    isError: isCollectionsError,
    isLoading: isCollectionsLoading,
    isFetching: isFetchingCollections,
  } = useCollectionListQuery({
    projectId: collectionProjectId,
    page
  }, {
    skip: !collectionProjectId || viewMode === ViewMode.Public
  });
  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    if (collectionsData?.total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, collectionsData?.total, page]);

  return (
    <>
      <CardList
        cardList={viewMode === ViewMode.Owner ? collections : []}
        isLoading={isCollectionsLoading}
        isError={isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} title='Tags'  style={{ height: '232px' }}  />
            <AuthorInformation
              name={name}
              avatar={avatar}
            />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={!!page && isFetchingCollections}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.MyLibraryCollections}
        emptyListPlaceHolder={emptyListPlaceHolder}
      />
      <Toast
        open={isCollectionsError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default CollectionsList;
