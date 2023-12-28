import { usePublicPromptListQuery } from '@/api/prompts.js';
import { ContentType, ViewMode } from '@/common/constants';
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
const emptySearchedListPlaceHolder = <div>No prompts found yet. <br />Publish yours now!</div>;

export default function Latest () {
  const {
    renderCard,
  } = useCardList(ViewMode.Public);
  const {query} = useSelector(state => state.search);
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds, calculateTagsWidthOnCard } = useTags(tagList);
  const [page, setPage] = React.useState(0);

  const { data, error, isError, isLoading, isFetching } = usePublicPromptListQuery({
    page,
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
    }
  });

  const { total } = data || {};
  
  const { filteredList } = useSelector((state) => state.prompts);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    setPage(page + 1);
  }, [total, filteredList.length, page]);
  
  React.useEffect(() => {
    if(data){
      calculateTagsWidthOnCard();
    }
  }, [calculateTagsWidthOnCard, data])

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isLoading}
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
        emptyListPlaceHolder={query ? emptySearchedListPlaceHolder : emptyListPlaceHolder}
        />
      <Toast
        open={isError && !!page}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}