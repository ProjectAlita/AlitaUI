/* eslint-disable no-unused-vars */
import { useLazyCollectionListQuery } from '@/api/collections';
import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { ContentType, PromptStatus, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useViewModeFromUrl, useCollectionProjectId } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';

const CollectionsList = ({
  rightPanelOffset,
  sortBy,
  sortOrder,
  status,
}) => {
  const viewMode = useViewModeFromUrl();
  const {
    renderCard,
    PAGE_SIZE
  } = useCardList(viewMode);

  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);

  const [loadCollections, { 
    error,
    data: collectionsData, 
    isError: isCollectionsError, 
    isLoading: isCollectionsLoading}] = useLazyCollectionListQuery();
  const { rows: collections = [] } = collectionsData || {};

  const collectionProjectId = useCollectionProjectId();
  

  const loadMoreCollections = React.useCallback(() => {}, []);

  React.useEffect(() => {
    if (collectionProjectId) {
      loadCollections({
        projectId: collectionProjectId,
        params: {
          limit: PAGE_SIZE,
          offset: 0
        }
      })
    }
  }, [PAGE_SIZE, loadCollections, collectionProjectId])


  const meta = {
    [ContentType.Collections]: {
      cardList: collections || [],
      isLoading: isCollectionsLoading,
      isLoadingMore: false,
      isError: isCollectionsError,
      isMoreError: false,
      error: null,
      loadMoreFunc: loadMoreCollections,
      cardType: ContentType.Collections
    }
  }

  return (
    <>
      <CardList
        cardList={collections}
        isLoading={isCollectionsLoading}
        isError={isCollectionsError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={tagList} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        loadMoreFunc={loadMoreCollections}
        cardType={ContentType.Collections}
      />
      <Toast
        open={false}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default CollectionsList;
