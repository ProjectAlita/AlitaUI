import { ContentType, PUBLIC_PROJECT_ID, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrendingAuthors from '../PromptList/TrendingAuthors';
import { useCollectionListQuery, apis, TAG_TYPE_COLLECTION_LIST } from '@/api/collections';

const emptyListPlaceHolder = <div>No public collections yet. <br />Publish yours now!</div>;

export default function Latest() {
  const dispatch = useDispatch();
  const {
    renderCard,
  } = useCardList(ViewMode.Public);

  const { tagList } = useSelector((state) => state.prompts);

  const [page, setPage] = React.useState(0);
  const { error,
    data: collectionsData,
    isError,
    isLoading,
    isFetching,
  } = useCollectionListQuery({
    projectId: PUBLIC_PROJECT_ID,
    page
  });
  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    if (collectionsData?.total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, collectionsData?.total, page]);

  React.useEffect(() => {
    if (isError) {
      dispatch(apis.util.invalidateTags([TAG_TYPE_COLLECTION_LIST]));
    }
  }, [dispatch, isError]); 

  return (
    <>
      <CardList
        cardList={collections}
        isLoading={isLoading || isFetching }
        isError={isError}
        rightPanelOffset={'82px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            <TrendingAuthors />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isLoading}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.CollectionsLatest}
        emptyListPlaceHolder={emptyListPlaceHolder}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}