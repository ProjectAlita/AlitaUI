import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import PromptCard from '@/components/Card.jsx';
import { useSelector } from 'react-redux';

const useCardList = (viewMode, collectionName) => {
  const PAGE_SIZE = 20;
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [selectedTagIds, setSelectedTagIds] = React.useState('');

  const { tagList } = useSelector((state) => state.prompts);

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

  const renderCard = React.useCallback(
    (cardData, cardType) => {
      return (
        <PromptCard data={cardData} viewMode={viewMode} type={cardType} collectionName={collectionName}/>
      );
    },
    [collectionName, viewMode],
  );

  React.useEffect(() => {
    const tags = getTagsFromUrl();
    setSelectedTags(tags);
    setSelectedTagIds(mapTagNamesToIds(tags));
  }, [getTagsFromUrl, mapTagNamesToIds]);

  return {
    mapTagNamesToIds,
    renderCard,
    selectedTags,
    selectedTagIds,
    setSelectedTags,
    tagList,
    getTagsFromUrl,
    PAGE_SIZE,
  };
};

export default useCardList;