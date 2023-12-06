import { useLazyCollectionListQuery } from '@/api/collections';
import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { ContentType, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useProjectId } from '@/pages/EditPrompt/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';

const MyCardList = ({
  viewMode,
  type,
  rightPanelOffset,
  sortBy,
  sortOrder,
  status,
}) => {

  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);

  const [loadPrompts, {
    data,
    isError: isPromptError,
    isLoading: isPromptLoading,
    isFetching: isPromptFirstFetching }] = useLazyPromptListQuery();

  const [loadCollections, { 
    data: collectionsData, 
    isError: isCollectionsError, 
    isLoading: isCollectionsLoading}] = useLazyCollectionListQuery();
  const { rows: collections } = collectionsData || {};
    
  const [loadMore, {
    isError: isMorePromptError,
    isFetching: isPromptFetching,
    error: promptError
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};
  const projectId = useProjectId();
  const { filteredList } = useSelector((state) => state.prompts);
  const { id: authorId } = useSelector((state) => state.user);
  const [offset, setOffset] = React.useState(0);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;

    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadMore({
      projectId,
      params: {
        limit: PAGE_SIZE,
        offset: newOffset,
        tags: selectedTagIds,
        author_id: viewMode === ViewMode.Public ? authorId : undefined,
        status: status !== PromptStatus.All ? status : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      }
    })
  }, [
    PAGE_SIZE,
    authorId,
    filteredList.length,
    loadMore,
    offset,
    projectId,
    selectedTagIds,
    sortBy,
    sortOrder,
    status,
    total,
    viewMode]);

  React.useEffect(() => {
    if (projectId && (viewMode !== ViewMode.Public || authorId)) {
      loadPrompts({
        projectId,
        params: {
          limit: PAGE_SIZE,
          offset: 0,
          tags: selectedTagIds,
          author_id: viewMode === ViewMode.Public ? authorId : undefined,
          status: status !== PromptStatus.All ? status : undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        }
      });
      setOffset(0);
    }
  }, [
    PAGE_SIZE,
    authorId,
    loadPrompts,
    projectId,
    selectedTagIds,
    sortBy,
    sortOrder,
    status,
    viewMode]);

  const loadMoreCollections = React.useCallback(() => {}, []);

  React.useEffect(() => {
    if (projectId) {
      loadCollections({
        projectId,
        params: {
          limit: PAGE_SIZE,
          offset: 0
        }
      })
    }
  }, [PAGE_SIZE, loadCollections, projectId])

  if (isPromptError) return <>error</>;

  const promptMeta = {
    cardList: filteredList,
    isLoading: isPromptLoading || isPromptFirstFetching,
    isLoadingMore: isPromptFetching,
    isError: isPromptError,
    isMoreError: isMorePromptError,
    error: promptError,
    loadMoreFunc: loadMorePrompts,
    cardType: ContentType.Prompts
  };
  const meta = {
    [ContentType.All]: promptMeta,
    [ContentType.Prompts]: promptMeta,
    [ContentType.Datasources]: {
      cardList: [],
      isLoading: false,
      isLoadingMore: false,
      isError: null,
      isMoreError: false,
      error: null,
      loadMoreFunc: null,
      cardType: ContentType.Datasources
    },
    [ContentType.Collections]: {
      cardList: collections || [],
      isLoading: isCollectionsLoading,
      isLoadingMore: false,
      isError: isCollectionsError,
      isMoreError: false,
      error: null,
      loadMoreFunc: loadMoreCollections,
      cardType: ContentType.Collections
    }
  }

  const {
    cardList,
    isLoading,
    isLoadingMore,
    isError,
    isMoreError,
    error,
    loadMoreFunc,
    cardType
  } = meta[type];

  return (
    <>
      <CardList
        cardList={cardList}
        isLoading={isLoading}
        isError={isError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isLoadingMore}
        loadMoreFunc={loadMoreFunc}
        cardType={cardType}
      />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default MyCardList;
