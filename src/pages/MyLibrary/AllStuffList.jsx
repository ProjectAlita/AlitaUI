import { useCollectionListQuery } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage, sortByCreatedAt } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useAuthorIdFromUrl, usePageQuery, useProjectId, useViewMode } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import RightPanel from './RightPanel';
import { getQueryStatuses, useLoadPrompts } from './useLoadPrompts';
import { useLoadDatasources } from './useLoadDatasources';

const EmptyListPlaceHolder = ({ query, viewMode, name }) => {
  if (!query) {
    if (viewMode !== ViewMode.Owner) {
      return <div>{`${name} has not created anything yet.`}</div>
    } else {
      return <div>You have not created anything yet. <br />Create yours now!</div>
    }
  } else {
    return <div>Nothing found. <br />Create yours now!</div>;
  }
};

const AllStuffList = ({
  rightPanelOffset,
  sortBy,
  sortOrder,
  statuses,
}) => {
  const { query, page, setPage, pageSize } = usePageQuery();
  const viewMode = useViewMode();
  const {
    renderCard,
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);

  const {
    loadMore,
    data,
    isPromptError,
    isMorePromptError,
    isPromptFirstFetching,
    isPromptFetching,
    isPromptLoading,
    promptError,
  } = useLoadPrompts(viewMode, selectedTagIds, sortBy, sortOrder, statuses);

  const { total = 0 } = data || {};
  const authorId = useAuthorIdFromUrl();
  const { filteredList } = useSelector((state) => state.prompts);
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    loadMore();
  }, [filteredList.length, loadMore, total]);

  const projectId = useProjectId();
  const { error: collectionError,
    data: collectionsData,
    isError: isCollectionsError,
    isLoading: isCollectionsLoading,
    isFetching: isCollectionFetching,
  } = useCollectionListQuery({
    projectId: projectId,
    page,
    pageSize,
    params: {
      query,
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: getQueryStatuses(statuses),
    }
  }, {
    skip: !projectId
  });
  const { rows: collections = [], total: collectionTotal = 0 } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    if (collectionTotal <= collections.length) {
      return;
    } 
    setPage(page + 1);
  }, [collectionTotal, collections.length, page, setPage]);

  const {
    onLoadMorePublicDatasources,
    data: datasourcesData,
    isDatasourcesError,
    isDatasourcesFetching,
    isDatasourcesLoading,
    datasourcesError,
  } = useLoadDatasources(viewMode, selectedTagIds, sortBy, sortOrder, statuses);
  const { rows: datasources = [], total: datasourcesTotal = 0 } = datasourcesData || {};

  const loadMoreDatasources = React.useCallback(() => {
    if (datasourcesTotal <= datasources.length) {
      return;
    } 
    onLoadMorePublicDatasources();
  }, [datasourcesTotal, datasources.length, onLoadMorePublicDatasources]);

  const onLoadMore = React.useCallback(
    () => {
      if (!isPromptFetching && !isCollectionFetching && !isDatasourcesFetching) {
        loadMorePrompts();
        loadMoreCollections();
        loadMoreDatasources();
      }
    },
    [isCollectionFetching, isDatasourcesFetching, isPromptFetching, loadMoreCollections, loadMoreDatasources, loadMorePrompts],
  );

  const realDataList = React.useMemo(() => {
    const prompts = filteredList.map((prompt) => ({
      ...prompt,
      cardType: viewMode === ViewMode.Owner ? ContentType.MyLibraryPrompts : ContentType.UserPublicPrompts,
    }));
    const collectionList = collections.map((collection) => ({
      ...collection,
      cardType: viewMode === ViewMode.Owner ? ContentType.MyLibraryCollections : ContentType.UserPublicCollections,
    }));
    const datasourceList = datasources.map((collection) => ({
      ...collection,
      cardType: viewMode === ViewMode.Owner ? ContentType.MyLibraryDatasources : ContentType.UserPublicDatasources,
    }));
    const finalList = [...prompts, ...collectionList, ...datasourceList].sort(sortByCreatedAt);
    return finalList;
  }, [collections, datasources, filteredList, viewMode]);

  return (
    <>
      <CardList
        mixedContent
        key={'AllStuffList'}
        cardList={realDataList}
        total={total + collectionTotal}
        isLoading={isPromptLoading || isPromptFirstFetching || isCollectionsLoading || isDatasourcesLoading}
        isError={isPromptError || isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={<RightPanel tagList={tagList} />}
        renderCard={renderCard}
        isLoadingMore={isPromptFetching}
        loadMoreFunc={onLoadMore}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryPrompts : ContentType.UserPublicPrompts}
        emptyListPlaceHolder={<EmptyListPlaceHolder query={query} viewMode={viewMode} name={name} />}
      />
      <Toast
        open={isMorePromptError || isPromptError || isCollectionsError || isDatasourcesError}
        severity={'error'}
        message={buildErrorMessage(promptError || collectionError || datasourcesError)}
      />
    </>
  );
};

export default AllStuffList;
