/* eslint-disable no-unused-vars */
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector } from 'react-redux';
import TrendingAuthors from '../PromptList/TrendingAuthors';

const emptyListPlaceHoler = <div>No public collections yet. <br />Publish yours now!</div>;

export default function Latest() {
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(ViewMode.Public);

  const { tagList } = useSelector((state) => state.prompts);
  const isError = false;
  const isMoreError = false;
  const filteredList = [];
  const isLoading = false;
  const isLoadingMore = false;
  const error = undefined;

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isLoading }
        isError={isError}
        rightPanelOffset={'82px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            <TrendingAuthors />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isLoadingMore}
        loadMoreFunc={null}
        cardType={ContentType.PromptsLatest}
        placeHolder={emptyListPlaceHoler}
      />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}