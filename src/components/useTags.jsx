import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useDispatch } from 'react-redux';

/**
 * currently, we can find target element accurately this way,
 * since we are using MuiCard('@mui/material/Card') as the base component of our Card component.
 * if any relate structure of component modified in the future, please do the change accordingly
 */
const CARD_SELECTOR_PATH = '.MuiCardContent-root div[style="cursor: pointer; caret-color: transparent;"]';

const useTags = (tagList = []) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [alreadyGetElement, setGetElement] = React.useState(false)

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
      .filter(item => tags.includes(item?.name))
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

  // record all tags into Redux with their width by creating a tempContainer.
  // it will run everytime when tagList changes
  const calculateTagsWidthOnCard = React.useCallback(() => {
    // TODO: find a more general way to filter out target element, or import component
    const renderedTagContainer = document.querySelector(CARD_SELECTOR_PATH);
    // prevent unnecessary calculation
    // no need to calculate when:
    //   1. yet tag container template hasn't been rendered(renderedTagContainer)
    //   2. already have gotten tag container template.
    //   3. tagList is empty, which means either there could be no data, or yet hasn't fetched from server
    if(!renderedTagContainer || alreadyGetElement || !tagList.length) return;

    const tagWidthOnCard = {};
    const htmlBody = document.body;
    const clonedElement = renderedTagContainer.cloneNode(true);
    const textContent = clonedElement.textContent;
    
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-container';
    tempContainer.style.display = 'flex';
    htmlBody.appendChild(tempContainer);
    
    tagList.forEach(tag => {
      const { name = '' } = tag;
      const updatedElement = clonedElement.outerHTML.replace(`>${textContent}<`, `>${name}<`)
      tempContainer.innerHTML = updatedElement;
      const currentTagWidthOnCard = tempContainer.firstChild.getBoundingClientRect().width;
      tagWidthOnCard[name] = Math.round(currentTagWidthOnCard);
    })

    htmlBody.removeChild(tempContainer);
    dispatch(
      promptSliceActions.updateTagWidthOnCard({
        tagWidthOnCard
      })
    )
    setGetElement(true);
  }, [dispatch, alreadyGetElement, tagList])

  return {
    selectedTags,
    selectedTagIds,
    handleClickTag,
    handleClear,
    calculateTagsWidthOnCard
  };
};

export default useTags;