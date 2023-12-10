import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useDispatch } from 'react-redux';

const useTags = (tagList = []) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const getTagsFromUrl = React.useCallback(() => {
    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    const tagNamesFromUrl = currentQueryParam.getAll(URL_PARAMS_KEY_TAGS)?.filter(tag => tag !== '');
    return tagNamesFromUrl;
  }, [location.search]);

  const selectedTags = React.useMemo(() => {
    return getTagsFromUrl();
  }, [getTagsFromUrl]);

  const getTagIdsFromUrl = React.useCallback(() => {
    const tags = getTagsFromUrl();
    return tagList
      .filter(item => tags.includes(item.name))
      .map(item => item.id)
      .join(',');
  }, [getTagsFromUrl, tagList]);

  const selectedTagIds = React.useMemo(() => {
    return getTagIdsFromUrl();
  }, [getTagIdsFromUrl]);
  const navigate = useNavigate();

  const navigateWithTags = React.useCallback(
    (tags) => {
      const currentQueryParam = location.search
        ? new URLSearchParams(location.search)
        : new URLSearchParams();
      currentQueryParam.delete(URL_PARAMS_KEY_TAGS);
      if (tags.length > 0) {
        for (const tag of tags) {
          currentQueryParam.append(URL_PARAMS_KEY_TAGS, tag);
        }
      }

      navigate(
        {
          pathname: location.pathname,
          search: decodeURIComponent(currentQueryParam.toString()),
        },
        { replace: true }
      );
    },
    [location.pathname, location.search, navigate]
  );

  const updateTagInUrl = React.useCallback(
    (newTag) => {
      const isExistingTag = selectedTags.includes(newTag);
      const tags = isExistingTag
        ? selectedTags.filter((tag) => tag !== newTag)
        : [...selectedTags, newTag];

      navigateWithTags(tags);
    },
    [navigateWithTags, selectedTags]
  );

  const handleClickTag = React.useCallback(
    (e) => {
      const newTag = e.target.innerText;
      updateTagInUrl(newTag, selectedTags);
      dispatch(
        promptSliceActions.reorderTagList({
          tagName: newTag,
          isUnselected: selectedTags.includes(newTag)
        })
      );
    },
    [updateTagInUrl, selectedTags, dispatch]
  );


  const handleClear = React.useCallback(() => {
    navigateWithTags([]);
  }, [navigateWithTags]);
  return {
    selectedTags,
    selectedTagIds,
    handleClickTag,
    handleClear
  };
};

export default useTags;