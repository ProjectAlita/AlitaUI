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
import useDispatchQueryParams from './useDispatchQueryParams';

const emptyListPlaceHolder = <div>No public collections yet. <br />Publish yours now!</div>;
const emptySearchedListPlaceHolder = <div>No collections found. <br />Create yours now!</div>;

export default function Trending({trendRange}) {
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
      trend_start_period: trendRange,
    }
  });
  const { rows: collections = [] } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    if (data?.total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, data?.total, page, setPage]);

  useDispatchQueryParams(page, selectedTagIds, query, trendRange);

  return (
    <>
      <CardList
        cardList={collections}
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