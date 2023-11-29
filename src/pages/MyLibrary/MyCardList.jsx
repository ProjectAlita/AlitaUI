import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { SOURCE_PROJECT_ID, URL_PARAMS_KEY_TAGS } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast.jsx';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CardList from '@/components/CardList';
import PromptCard from '@/components/Card.jsx';
import LastVisitors from './LastVisitors';
import Categories from '../../components/Categories';

const LOAD_PROMPT_LIMIT = 20;

// eslint-disable-next-line no-unused-vars
const MyCardList = ({ type, mode }) => {
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);

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
    if (mode !== 'owner' || privateProjectId) {
      const tags = getTagsFromUrl();
      setSelectedTags(tags);
      loadPrompts({
        projectId: mode !== 'owner' ? SOURCE_PROJECT_ID : privateProjectId,
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
    }
  }, [getTagsFromUrl, loadPrompts, mode, privateProjectId, tagList]);

  const loadMorePrompts = React.useCallback(() => {
    const newOffset = offset + LOAD_PROMPT_LIMIT;
    setOffset(newOffset);
    loadMore({
      projectId: mode !== 'owner' ? SOURCE_PROJECT_ID : privateProjectId,
      params: {
        limit: LOAD_PROMPT_LIMIT,
        offset: newOffset,
        tags: tagList
          .filter(item => selectedTags.includes(item.name))
          .map(item => item.id)
          .join(','),
      }
    })
  }, [offset, loadMore, mode, privateProjectId, tagList, selectedTags]);

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
        rightPanelOffset={'132px'}
        rightPanelContent={
          <>
            <Categories tagList={tagList} selectedTags={selectedTags} />
            {mode === 'owner' && <LastVisitors />}
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

export default MyCardList;
