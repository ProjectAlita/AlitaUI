import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useViewModeFromUrl } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLoadPrompts } from './useLoadPrompts';
import AuthorInformation from '@/components/AuthorInformation';
import useQueryTrendingAuthor from './useQueryTrendingAuthor';

const EmptyListPlaceHolder = ({ query, viewMode, name }) => {
  if (!query) {
    if (viewMode !== ViewMode.Owner) {
      return <div>{`${name} has not created prompts yet.`}</div>
    } else {
      return <div>You have not created prompts yet. <br />Create yours now!</div>
    }
  } else {
    return <div>Nothing found. <br />Create yours now!</div>;
  }
};

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
  const { total } = data || {};
  const { filteredList } = useSelector((state) => state.prompts);
  const { isLoadingAuthor } = useQueryTrendingAuthor();
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && (filteredList.length < total);
    if (!existsMore || isPromptFetching) return;
    loadMore();
  }, [filteredList.length, isPromptFetching, loadMore, total]);

  return (
    <>
      <CardList
        key={'PromptList'}
        cardList={filteredList}
        isLoading={isPromptLoading || isPromptFirstFetching}
        isError={isPromptError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} title='Tags' style={{ height: '232px' }} />
            <AuthorInformation
              isLoading={isLoadingAuthor}
            />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isPromptFetching}
        loadMoreFunc={loadMorePrompts}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryPrompts : ContentType.UserPublicPrompts}
        emptyListPlaceHolder={<EmptyListPlaceHolder query={query} viewMode={viewMode} name={name} />}
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
