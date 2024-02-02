import {
  AutoSuggestionTitles,
  AutoSuggestionTypes,
  PromptStatus,
  SortFields,
  SortOrderOptions
} from '@/common/constants';
import { useCallback, useEffect, useState } from 'react';
import { ListSection, StyledList, StyledListItem } from './SearchBarComponents';
import { useSearchPromptNavigate } from './useCardNavigate';
import useSearch from './useSearch';
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


export default function SuggestionList({
  searchString,
  isEmptyInput,
  searchTags,
  searchTagLength,
  showTopData,
  handleClickTop,
  handleAddTag,
}) {
  const {
    projectId,
    ApiToast,
    isFetchingTop,
    topResult,
    topTotal,
    getSuggestion,
    isFetching,
    tagResult,
    tagTotal,
    promptResult,
    promptTotal,
    collectionResult,
    collectionTotal,
  } = useSearch(showTopData);

  const [page, setPage] = useState(0);
  const getSuggestions = useCallback((inputValue, tags) => {
    getSuggestion({
      projectId,
      page,
      params: {
        query: inputValue,
        sort: SortFields.Id,
        order: SortOrderOptions.DESC,
        'entities[]': AutoSuggestionTypes,
        'statuses[]': [PromptStatus.Published],
        'tags[]': tags.length ? tags.map(t => t.id) : undefined,
      }
    });
  }, [getSuggestion, page, projectId])

  const fetchMoreData = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  // dopropdown data load / load more
  const debouncedInputValue = useDebounce(searchString, 500);
  useEffect(() => {
    if (!isEmptyInput || searchTagLength) {
      setPage(0);
      getSuggestions(debouncedInputValue, searchTags);
    }
  }, [getSuggestions, isEmptyInput, page, debouncedInputValue, searchTagLength, searchTags]);

  useEffect(() => {
    if (page > 0) {
      getSuggestions(searchString, searchTags);
    }
  }, [getSuggestions, page, searchString, searchTags]);

  const {
    doNavigatePrompt,
    doNavigateCollection,
  } = useSearchPromptNavigate();

  const navToPrompt = useCallback((promptId, promptName) => {
    doNavigatePrompt({
      id: promptId,
      name: promptName
    })
  }, [doNavigatePrompt]);

  const navToCollection = useCallback((collectionId, collectionName) => {
    doNavigateCollection({
      id: collectionId,
      name: collectionName
    })
  }, [doNavigateCollection]);
  const renderTopItem = useCallback(({ search_keyword }) => {
    return (
      <StyledListItem
        // eslint-disable-next-line react/jsx-no-bind
        key={search_keyword} onClick={() => handleClickTop(search_keyword)}>
        {search_keyword}
      </StyledListItem>
    )
  }, [handleClickTop]);

  const renderTagItem = useCallback((tag) => {
    const { name, id } = tag;
    // eslint-disable-next-line react/jsx-no-bind
    return <StyledListItem key={id} onClick={() => handleAddTag(tag)}>{name}</StyledListItem>
  }, [handleAddTag]);

  const renderPromptItem = useCallback(({ id, name }) => {
    // eslint-disable-next-line react/jsx-no-bind
    return <StyledListItem key={id} onClick={() => navToPrompt(id, name)}>
      {name}
    </StyledListItem>
  }, [navToPrompt]);

  const renderCollectionItem = useCallback(({ id, name }) => {
    // eslint-disable-next-line react/jsx-no-bind
    return <StyledListItem key={id} onClick={() => navToCollection(id, name)}>
      {name}
    </StyledListItem>
  }, [navToCollection]);
  return (
    <StyledList>
      {
        showTopData ?
          <ListSection
            sectionTitle={AutoSuggestionTitles.TOP}
            data={topResult}
            total={topTotal}
            isFetching={isFetchingTop}
            renderItem={renderTopItem}
            emptyHint='No Data'
          />
          :
          <>
            <ListSection
              sectionTitle={AutoSuggestionTitles.TAGS}
              data={tagResult}
              total={tagTotal}
              isFetching={isFetching}
              renderItem={renderTagItem}
              fetchMoreData={fetchMoreData}
            />
            <ListSection
              sectionTitle={AutoSuggestionTitles.PROMPTS}
              data={promptResult}
              total={promptTotal}
              isFetching={isFetching}
              renderItem={renderPromptItem}
              fetchMoreData={fetchMoreData}
            />
            <ListSection
              sectionTitle={AutoSuggestionTitles.COLLECTIONS}
              data={collectionResult}
              total={collectionTotal}
              isFetching={isFetching}
              renderItem={renderCollectionItem}
              fetchMoreData={fetchMoreData}
            />
          </>
      }
      <ApiToast />
    </StyledList>
  )
}