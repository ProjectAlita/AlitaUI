import { CollectionStatus, ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector } from 'react-redux';
import TrendingAuthors from '@/components/TrendingAuthors';
import { usePageQuery } from '@/pages/hooks';
import { rightPanelStyle, tagsStyle } from '@/pages/MyLibrary/CommonStyles';
import useTags from '@/components/useTags';
import useApplicationDispatchQueryParams from './useApplicationsDispatchQueryParams';
import { usePublicApplicationsListQuery } from '@/api/applications';

const emptyListPlaceHolder = <div>No public applications yet. <br />Publish yours now!</div>;
const emptySearchedListPlaceHolder = <div>No applications found. <br />Create yours now!</div>;

export default function Latest() {
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
  } = usePublicApplicationsListQuery({
    page,
    params: {
      statuses: CollectionStatus.Published,
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
    }
  });
  const { rows: collections = [], total } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    if (total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, total, page, setPage]);

  useApplicationDispatchQueryParams(page, selectedTagIds, query);

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
            <Categories tagList={tagList} style={tagsStyle} />
            <TrendingAuthors />
          </div>
        }
        renderCard={renderCard}
        isLoadingMore={!!page && isFetching}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.DatasourcesLatest}
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