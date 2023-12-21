import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useProjectId, useViewModeFromUrl } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';
import { useLoadPrompts } from './useLoadPrompts';

const emptyListPlaceHoler = <div>You have not created anything yet. <br />Create yours now!</div>;

const AllStuffList = ({
  rightPanelOffset,
  sortBy,
  sortOrder,
  statuses,
}) => {
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds, calculateTagsWidthOnCard, setGetElement } = useTags(tagList);

  const {
    loadPrompts,
    loadMore,
    data,
    isPromptError,
    isMorePromptError,
    isPromptFirstFetching,
    isPromptFetching,
    isPromptLoading,
    promptError,
  } = useLoadPrompts(viewMode);

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
        statuses: statuses.length ? statuses.join(',') : undefined,
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
    statuses,
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
          statuses: statuses.length ? statuses.join(',') : undefined,
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
    statuses,
    viewMode]);

    React.useEffect(() => {
      if(isPromptFirstFetching || isPromptFetching) return
      calculateTagsWidthOnCard();
      setGetElement(false);
    }, [calculateTagsWidthOnCard, setGetElement, isPromptFirstFetching, isPromptFetching])

  
  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isPromptLoading || isPromptFirstFetching}
        isError={isPromptError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isPromptFetching}
        loadMoreFunc={loadMorePrompts}
        cardType={ContentType.MyLibraryPrompts}
        placeHolder={emptyListPlaceHoler}
      />
      <Toast
        open={isMorePromptError}
        severity={'error'}
        message={buildErrorMessage(promptError)}
      />
    </>
  );
};

export default AllStuffList;
