import { useCollectionListQuery } from '@/api/collections';
import { CollectionStatus, ContentType, PUBLIC_PROJECT_ID, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { rightPanelStyle, tagsStyle } from '@/pages/MyLibrary/CommonStyles';
import TrendingAuthors from '@/pages/PromptList/TrendingAuthors';
import { usePageQuery } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import useDatasourceDispatchQueryParams from './useDatasourceDispatchQueryParams';

const emptyListPlaceHolder = <div>You have not liked any data sources yet. <br />Choose the data sources you like now!</div>;
const emptySearchedListPlaceHolder = <div>No data sources found yet. <br />Publish yours now!</div>;

export default function MyLiked() {
  const {
    renderCard,
  } = useCardList(ViewMode.Public);
  const { query, page, setPage } = usePageQuery();

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const { error,
    data,
    isError,
    isFetching,
  } = useCollectionListQuery({
    projectId: PUBLIC_PROJECT_ID,
    page,
    params: {
      statuses: CollectionStatus.Published,
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
      my_liked: true
    }
  });
  const { rows: collections = [], total } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    if (total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, total, page, setPage]);

  useDatasourceDispatchQueryParams(page, selectedTagIds, query);
  
  return (
    <>
      <CardList
        cardList={collections}
        total={total}
        isLoading={isFetching}
        isError={isError}
        rightPanelOffset={'82px'}
        rightPanelContent={
          <div style={rightPanelStyle}>
            <Categories tagList={tagList} style={tagsStyle} my_liked />
            <TrendingAuthors />
          </div>
        }
        renderCard={renderCard}
        isLoadingMore={!!page && isFetching}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.CollectionsLatest}
        emptyListPlaceHolder={query ? emptySearchedListPlaceHolder : emptyListPlaceHolder}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}