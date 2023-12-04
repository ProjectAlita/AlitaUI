import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import { useProjectId } from '@/pages/EditPrompt/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';

const buildMockCollections = (total) => {
  const mockData = {
    total,
    list: []
  }
  for (let i = 0; i < total; i++) {
    const element = {
      id: i,
      name: 'Collection name',
      description: 'Amet consectetur. Ornare egestas enim facilisis quis senectus a nunc habitasse blandit. Vitae nibh turpis scelerisque commodo egestas id morbi urna in.',
      promptCount: 13,
      authors: [{ id: 1, name: 'George Developer' }]
    };
    
    mockData.list.push(element);
  }
  return mockData;
}

const MyCardList = ({viewMode, type}) => {
  const {
    renderCard,
    selectedTags,
    selectedTagIds,
    tagList,
    PAGE_SIZE,
  } = useCardList(viewMode);
  const [loadPrompts, { 
    data, 
    isError: isPromptError, 
    isLoading: isPromptLoading,
    isFetching: isPromptFirstFetching }] = useLazyPromptListQuery();
  const [loadMore, {
    isError: isMorePromptError,
    isFetching: isPromptFetching,
    error: promptError
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};
  const projectId = useProjectId();
  const { filteredList } = useSelector((state) => state.prompts);
  const { id: author_id } = useSelector((state) => state.user);
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
        author_id: viewMode === ViewMode.Public ? author_id : undefined 
      }
    })
  }, [PAGE_SIZE, author_id, filteredList.length, loadMore, offset, projectId, selectedTagIds, total, viewMode]);

  React.useEffect(() => {
    if (projectId && (viewMode !== ViewMode.Public || author_id)) {
      loadPrompts({
        projectId,
        params: {
          limit: PAGE_SIZE,
          offset: 0,
          tags: selectedTagIds,
          author_id: viewMode === ViewMode.Public ? author_id : undefined 
        }
      });
      setOffset(0);
    }
  }, [PAGE_SIZE, author_id, loadPrompts, projectId, selectedTagIds, viewMode]);

  // TODO: replace mock data with data from API
  const loadMoreCollections = React.useCallback(() => {}, []);

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
    [ContentType.Datasources]: promptMeta,
    [ContentType.Collections]: {
      cardList: buildMockCollections(10).list,
      isLoading: false,
      isLoadingMore: false,
      isError: false,
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
        rightPanelOffset={'132px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} selectedTags={selectedTags} />
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
