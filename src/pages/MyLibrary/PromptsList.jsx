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
import { useLoadPrompts } from './useLoadPrompts';
import AuthorInformation from '@/components/AuthorInformation';

const emptyListPlaceHolder = <div>You have not created prompts yet. <br />Create yours now!</div>;
const emptySearchedListPlaceHolder = <div>Nothing found. <br />Create yours now!</div>;

const PromptsList = ({
  rightPanelOffset,
  sortBy,
  sortOrder,
  statuses,
}) => {
  const { query } = useSelector(state => state.search);
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);

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
    const existsMore = total && (filteredList.length < total);
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
        query,
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
    query,
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
          query,
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
    query,
    viewMode]);

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isPromptLoading || isPromptFirstFetching}
        isError={isPromptError}
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
        loadMoreFunc={loadMorePrompts}
        cardType={ContentType.MyLibraryPrompts}
        emptyListPlaceHolder={query ? emptySearchedListPlaceHolder : emptyListPlaceHolder}
      />
      <Toast
        open={isMorePromptError}
        severity={'error'}
        message={buildErrorMessage(promptError)}
      />
    </>
  );
};

export default PromptsList;
