import { useCollectionListQuery } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useAuthorIdFromUrl, usePageQuery, useProjectId, useViewMode } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import RightPanel from './RightPanel';
import { getQueryStatuses } from './useLoadPrompts';

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
  statuses,
}) => {
  const { query, page, setPage, pageSize } = usePageQuery();
  const viewMode = useViewMode();
  const {
    renderCard,
  } = useCardList(viewMode);
  const authorId = useAuthorIdFromUrl();
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const collectionProjectId = useProjectId();
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);
  const { error,
    data,
    isError,
    isFetching,
  } = useCollectionListQuery({
    projectId: collectionProjectId,
    page,
    pageSize,
    params: {
      query,
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: getQueryStatuses(statuses),
    }
  }, {
    skip: !collectionProjectId
  });

  const { rows: collections = [], total } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    const existsMore = collections.length < total;
    if (!existsMore || isFetching) return;
    setPage(page + 1);
  }, [collections.length, total, isFetching, page, setPage]);

  return (
    <>
      <CardList
        key={'CollectionList'}
        cardList={collections}
        total={total}
        isLoading={isFetching}
        isError={isError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={<RightPanel tagList={tagList} />}
        renderCard={renderCard}
        isLoadingMore={!!page && isFetching}
        loadMoreFunc={loadMoreCollections}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryCollections : ContentType.UserPublicCollections}
        emptyListPlaceHolder={<EmptyListPlaceHolder viewMode={viewMode} name={name} />}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default CollectionsList;
