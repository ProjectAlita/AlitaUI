import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { SOURCE_PROJECT_ID, URL_PARAMS_KEY_TAGS } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast.jsx';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CardList from '@/components/CardtList';
import PromptCard from '@/components/Card.jsx';
import Categories from './Categories';
import TrendingAuthors from './TrendingAuthors';

const LOAD_PROMPT_LIMIT = 20;

const PromptList = () => {
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [offset, setOffset] = React.useState(0);

  const getTagsFromUrl = React.useCallback(() => {
    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    return currentQueryParam.getAll(URL_PARAMS_KEY_TAGS)?.filter(tag => tag !== '');
  }, [location.search]);

  const [loadPrompts, { data, isError, isLoading }] = useLazyPromptListQuery();
  const [loadMore, {
    isError: isMoreError,
    isFetching,
    error
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};

  const { filteredList, tagList } = useSelector((state) => state.prompts);

  React.useEffect(() => {
    const tags = getTagsFromUrl();
    setSelectedTags(tags);
    loadPrompts({
      projectId: SOURCE_PROJECT_ID,
      params: {
        limit: LOAD_PROMPT_LIMIT,
        offset: 0,
        tags: tagList
          .filter(item => tags.includes(item.name))
          .map(item => item.id)
          .join(','),
      }
    });
    setOffset(0);
  }, [getTagsFromUrl, loadPrompts, tagList]);

  const loadMorePrompts = React.useCallback(() => {
    const newOffset = offset + LOAD_PROMPT_LIMIT;
    setOffset(newOffset);
    loadMore({
      projectId: SOURCE_PROJECT_ID,
      params: {
        limit: LOAD_PROMPT_LIMIT,
        offset: newOffset,
        tags: tagList
          .filter(item => selectedTags.includes(item.name))
          .map(item => item.id)
          .join(','),
      }
    })
  }, [offset, loadMore, tagList, selectedTags]);

  const renderCard = React.useCallback(
    (cardData) => {
      return (
        <PromptCard data={cardData} />
      );
    },
    [],
  )

  const onScroll = React.useCallback(() => {
    const isScrollOver = window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (total && total > filteredList.length && isScrollOver) {
      loadMorePrompts();
    }
  }, [filteredList.length, loadMorePrompts, total]);

  if (isError) return <>error</>;

  return (
    <>
      <CardList
        cardList={filteredList}
        isLoading={isLoading}
        isError={isError}
        rightPanelContent={
          <>
            <Categories tagList={tagList} selectedTags={selectedTags} />
            <TrendingAuthors />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={isFetching}
        onScroll={onScroll}
        />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default PromptList;
