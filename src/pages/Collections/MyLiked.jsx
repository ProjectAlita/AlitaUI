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

const emptyListPlaceHolder = <div>You have not liked any collections yet. <br />Choose the collections you like now!</div>;
const emptySearchedListPlaceHolder = <div>No collections found yet. <br />Publish yours now!</div>;

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
      query,
      tags: selectedTagIds,
      statuses: CollectionStatus.Published,
      my_liked: true
    }
  });
  const { rows: collections = [] } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    if (data?.total <= collections.length) {
      return;
    }
    setPage(page + 1);
  }, [collections.length, data?.total, page, setPage]);

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