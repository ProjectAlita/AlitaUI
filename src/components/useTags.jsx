import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import * as React from 'react';
import { useLocation } from 'react-router-dom';

const useTags = (tagList) => {
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [selectedTagIds, setSelectedTagIds] = React.useState('');

  const getTagsFromUrl = React.useCallback(() => {
    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    return currentQueryParam.getAll(URL_PARAMS_KEY_TAGS)?.filter(tag => tag !== '');
  }, [location.search]);

  const mapTagNamesToIds = React.useCallback((tags) => {
    return tagList
      .filter(item => tags.includes(item.name))
      .map(item => item.id)
      .join(',');
  }, [tagList]);


  React.useEffect(() => {
    const tags = getTagsFromUrl();
    setSelectedTags(tags);
    setSelectedTagIds(mapTagNamesToIds(tags));
  }, [getTagsFromUrl, mapTagNamesToIds]);

  return {
    mapTagNamesToIds,
    selectedTags,
    selectedTagIds,
    setSelectedTags,
  };
};

export default useTags;