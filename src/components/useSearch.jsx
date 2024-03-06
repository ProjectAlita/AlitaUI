import { useLazyAutoSuggestQuery, useTopSearchQuery } from "@/api/search";
import { AutoSuggestionTitles, SUGGESTION_PAGE_SIZE } from "@/common/constants";
import { useProjectId } from "@/pages/hooks";
import { useEffect } from "react";
import useToast from './useToast';

const getErrorMessage = (error) => {
  return error?.data?.message || error?.data?.error
}
export default function useSearch(showTopData) {
  const projectId = useProjectId();
  const { ToastComponent: ApiToast, toastError, clearToast } = useToast({ topPosition: '10px'});

  const {
    data: topData = {},
    isFetching: isFetchingTop,
    error: topError,
  } = useTopSearchQuery({
    projectId,
    params: {
      limit: SUGGESTION_PAGE_SIZE,
      offset: 0
    }
  }, {
    skip: !projectId || !showTopData
  });
  const { rows: topResult = [], total: topTotal } = topData;

  useEffect(() => {
    if (!projectId || !showTopData || isFetchingTop) return;
    if (topError) {
      const errorMessage = AutoSuggestionTitles.TOP + ' Error: ' + getErrorMessage(topError);
      setTimeout(() => toastError(errorMessage), 100);
    }
  }, [topError, toastError, clearToast, projectId, showTopData, isFetchingTop]);

  const [getSuggestion, {
    data: suggestion = {},
    isFetching,
    error: suggestionError,
  }] = useLazyAutoSuggestQuery();
  const { tag = {}, prompt = {}, collection = {} } = suggestion || {};

  const { rows: tagResult = [], total: tagTotal } = tag || {};
  const { rows: promptResult = [], total: promptTotal } = prompt || {};
  const { rows: collectionResult = [], total: collectionTotal } = collection || {};

  useEffect(() => {
    if (isFetching) return;
    if (suggestionError) {
      toastError('Get Auto Suggestion Error: ' + getErrorMessage(suggestionError));
    }
  }, [isFetching, suggestionError, toastError]);

  return {
    projectId,
    ApiToast,
    isFetchingTop,
    topResult,
    topTotal,
    topError,
    getSuggestion,
    isFetching,
    tagResult,
    tagTotal,
    promptResult,
    promptTotal,
    collectionResult,
    collectionTotal,
  }
}