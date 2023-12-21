import { useLazyLoadMorePublicPromptsQuery, useLazyPublicPromptListQuery } from '@/api/prompts.js';
import { PUBLIC_PROJECT_ID, ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import * as React from 'react';
import { useSelector } from 'react-redux';
import TrendingAuthors from './TrendingAuthors';

const emptyListPlaceHolder = <div>No public prompts yet. <br />Publish yours now!</div>;

export default function Latest () {
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(ViewMode.Public);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds, calculateTagsWidthOnCard } = useTags(tagList);
  const [loadPrompts, { data, isError, isLoading, isFetching: isFirstFetching }] = useLazyPublicPromptListQuery();
  const [loadMore, {
    isError: isMoreError,
    isFetching,
    error
  }] = useLazyLoadMorePublicPromptsQuery();
  const { total } = data || {};
  
  const { filteredList } = useSelector((state) => state.prompts);
  const [offset, setOffset] = React.useState(0);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadMore({
      projectId: PUBLIC_PROJECT_ID,
      params: {
        limit: PAGE_SIZE,
        offset: newOffset,
        tags: selectedTagIds,
        sort_by: 'created_at',
        sort_order: 'desc',
      }
    })
  }, [total, filteredList.length, offset, PAGE_SIZE, loadMore, selectedTagIds]);
  
  React.useEffect(() => {
    loadPrompts({
      projectId: PUBLIC_PROJECT_ID,
      params: {
        limit: PAGE_SIZE,
        offset: 0,
        tags: selectedTagIds,
        sort_by: 'created_at',
        sort_order: 'desc',
      }
    });
    setOffset(0);
  }, [PAGE_SIZE, loadPrompts, selectedTagIds]);
  
  React.useEffect(() => {
    if(data){
      calculateTagsWidthOnCard();
    }
  }, [calculateTagsWidthOnCard, data])

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isLoading || isFirstFetching}
        isError={isError}
        rightPanelOffset={'82px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            <TrendingAuthors />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isFetching}
        loadMoreFunc={loadMorePrompts}
        cardType={ContentType.PromptsLatest}
        emptyListPlaceHolder={emptyListPlaceHolder}
        />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}