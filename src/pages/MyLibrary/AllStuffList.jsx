import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useProjectId, useViewModeFromUrl, useCollectionProjectId } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLoadPrompts } from './useLoadPrompts';
import AuthorInformation from '@/components/AuthorInformation';
import { useCollectionListQuery } from '@/api/collections';

// TODO: Now there is no created_at in collection list, so we use name for sorting.
// After BE fixes this issue, we should use created_at for sorting.
const itemSortFunc = (a, b) => {
  if (a.name < b.name) {
    return 1;
  } else if (a.name > b.name) {
    return -1;
  } else {
    return 0;
  }
}

const emptyListPlaceHolder = <div>You have not created anything yet. <br />Create yours now!</div>;

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
  const { id: authorId, name, avatar } = useSelector((state) => state.user);
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
    if (isPromptFirstFetching || isPromptFetching) return
    calculateTagsWidthOnCard();
    setGetElement(false);
  }, [calculateTagsWidthOnCard, setGetElement, isPromptFirstFetching, isPromptFetching]);


  const collectionProjectId = useCollectionProjectId();
  const [page, setPage] = React.useState(0);
  const { error: collectionError,
    data: collectionsData,
    isError: isCollectionsError,
    isLoading: isCollectionsLoading
  } = useCollectionListQuery({
    projectId: collectionProjectId,
    page
  }, {
    skip: !collectionProjectId || viewMode === ViewMode.Public
  });
  const { rows: collections = [] } = collectionsData || {};

  const loadMoreCollections = React.useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const onLoadMore = React.useCallback(
    () => {
      loadMorePrompts();
      loadMoreCollections();
    },
    [loadMoreCollections, loadMorePrompts],
  );

  const realDataList = React.useMemo(() => {
    const prompts = filteredList.map((prompt) => ({
      ...prompt,
      cardType: ContentType.MyLibraryPrompts,
    }));
    const collectionList = collections.map((collection) => ({
      ...collection,
      cardType: ContentType.MyLibraryCollections,
    }));
    const finalList = [...prompts, ...collectionList].sort(itemSortFunc);
    return finalList;
  }, [collections, filteredList]);

  return (
    <>
      <CardList
        cardList={realDataList}
        isLoading={isPromptLoading || isPromptFirstFetching || isCollectionsLoading}
        isError={isPromptError || isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} title='Tags' style={{ height: '232px' }} />
            <AuthorInformation
              name={name}
              avatar={avatar}
            />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isPromptFetching}
        loadMoreFunc={onLoadMore}
        cardType={ContentType.MyLibraryPrompts}
        emptyListPlaceHolder={emptyListPlaceHolder}
      />
      <Toast
        open={isMorePromptError}
        severity={'error'}
        message={buildErrorMessage(promptError || collectionError)}
      />
    </>
  );
};

export default AllStuffList;
