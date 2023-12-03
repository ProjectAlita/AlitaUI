import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectTag = React.useCallback(
    (newTag, selectedTags) => {
      const isExistingTag = selectedTags.includes(newTag);
      const tags = isExistingTag
        ? selectedTags.filter((tag) => tag !== newTag)
        : [...selectedTags, newTag];

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
  return {
    selectTag
  };
};

export default useCategories;
