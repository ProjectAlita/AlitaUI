import { useCollectionListQuery } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { useCollectionProjectId, useViewModeFromUrl, useAuthorIdFromUrl } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import AuthorInformation from '@/components/AuthorInformation';
import useQueryTrendingAuthor from './useQueryTrendingAuthor';

const EmptyListPlaceHolder = ({ query, viewMode, name }) => {
  if (!query) {
    if (viewMode !== ViewMode.Owner) {
      return <div>{`${name} has not created collections yet.`}</div>
    } else {
      return <div>You have not created collections yet. <br />Create yours now!</div>
    }
  } else {
    return <div>Nothing found. <br />Create yours now!</div>;
  }
};

const CollectionsList = ({
  rightPanelOffset,
}) => {
  const { query } = useSelector(state => state.search);
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
  } = useCardList(viewMode);
  const authorId = useAuthorIdFromUrl();
  const { tagList } = useSelector((state) => state.prompts);
  const collectionProjectId = useCollectionProjectId();
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);
  const { isLoadingAuthor } = useQueryTrendingAuthor();
  const [page, setPage] = React.useState(0);
  const { error,
    data: collectionsData,
    isError: isCollectionsError,
    isLoading: isCollectionsLoading,
    isFetching: isFetchingCollections,
  } = useCollectionListQuery({
    projectId: collectionProjectId,
    page,
    params: {
      query,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
    }
  }, {
    skip: !collectionProjectId
  });

  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    if (collectionsData?.total <= collections.length || isFetchingCollections) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, collectionsData?.total, isFetchingCollections, page]);

  return (
    <>
      <CardList
        key={'CollectionList'}
        cardList={collections}
        isLoading={isCollectionsLoading}
        isError={isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} title='Tags' style={{ height: '232px' }} />
            <AuthorInformation isLoading={isLoadingAuthor} />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={!!page && isFetchingCollections}
        loadMoreFunc={loadMoreCollections}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryCollections : ContentType.UserPublicCollections}
        emptyListPlaceHolder={<EmptyListPlaceHolder viewMode={viewMode} name={name} />}
      />
      <Toast
        open={isCollectionsError && !!page}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default CollectionsList;
