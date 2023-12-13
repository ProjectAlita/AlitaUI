/* eslint-disable no-unused-vars */
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector } from 'react-redux';
import LastVisitors from './LastVisitors';
import { useViewModeFromUrl } from '../hooks';

const DataSourcesList = ({
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

  return (
    <>
      <CardList
        cardList={[]}
        isLoading={false}
        isError={null}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={[]} />
            {viewMode === ViewMode.Owner && <LastVisitors />}
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        loadMoreFunc={null}
        cardType={ContentType.Datasources}
      />
      <Toast
        open={false}
        severity={'error'}
        message={buildErrorMessage(null)}
      />
    </>
  );
};

export default DataSourcesList;
