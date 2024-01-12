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
import { usePageQuery } from '@/pages/hooks';
import { rightPanelStyle, tagsStyle } from '@/pages/MyLibrary/CommonStyles';

const emptyListPlaceHolder = <div>You have not liked any prompts yet. <br />Choose the prompts you like now!</div>;
const emptySearchedListPlaceHolder = <div>No prompts found yet. <br />Publish yours now!</div>;

export default function MyLiked () {
  const {
    renderCard,
  } = useCardList(ViewMode.Public);
  const { query, page, setPage } = usePageQuery();

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);

  const { data, error, isError, isFetching } = usePublicPromptListQuery({
    page,
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
      my_liked: true,
    }
  });

  const { total } = data || {};
  
  const { filteredList } = useSelector((state) => state.prompts);
  const loadMorePrompts = React.useCallback(() => {
    const existsMore = total && filteredList.length < total;
    if (!existsMore) return;
    setPage(page + 1);
  }, [total, filteredList.length, setPage, page]);

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isFetching}
        isError={isError}
        rightPanelOffset={'82px'}
        rightPanelContent={
          <div style={rightPanelStyle}>
            <Categories tagList={tagList} style={tagsStyle}/>
            <TrendingAuthors />
          </div>
        }
        renderCard={renderCard}
        isLoadingMore={!!page && isFetching}
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