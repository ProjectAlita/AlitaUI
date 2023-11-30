import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';
import { useProjectId } from '@/pages/EditPrompt/hooks';

const MyCardList = ({viewMode}) => {
  const {
    renderCard,
    selectedTags,
    selectedTagIds,
    tagList,
    PAGE_SIZE,
  } = useCardList(viewMode);
  const [loadPrompts, { data, isError, isLoading, isFetching: isFirstFetching }] = useLazyPromptListQuery();
  const [loadMore, {
    isError: isMoreError,
    isFetching,
    error
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};
  const projectId = useProjectId();
  const { filteredList } = useSelector((state) => state.prompts);
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
      }
    })
  }, [PAGE_SIZE, filteredList.length, loadMore, offset, projectId, selectedTagIds, total]);

  React.useEffect(() => {
    if (projectId) {
      loadPrompts({
        projectId,
        params: {
          limit: PAGE_SIZE,
          offset: 0,
          tags: selectedTagIds,
        }
      });
      setOffset(0);
    }
  }, [PAGE_SIZE, loadPrompts, projectId, selectedTagIds]);

  if (isError) return <>error</>;

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isLoading || isFirstFetching}
        isError={isError}
        rightPanelOffset={'132px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} selectedTags={selectedTags} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={loadMorePrompts}
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
