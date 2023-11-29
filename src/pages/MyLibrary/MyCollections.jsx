import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import Categories from '../../components/Categories';
import LastVisitors from './LastVisitors';


const buildMockData = (total) => {
  const mockData = {
    total,
    list: []
  }
  for (let i = 0; i < total; i++) {
    const element = {
      id: i,
      name: 'Collection name',
      description: 'Amet consectetur. Ornare egestas enim facilisis quis senectus a nunc habitasse blandit. Vitae nibh turpis scelerisque commodo egestas id morbi urna in.',
      tags: [{ id: 1, name: '13' }],
      authors: [{ id: 1, name: 'George Developer' }]
    };
    
    mockData.list.push(element);
  }
  return mockData;
}

const MyCollections = ({mode}) => {
  // TODO: replace mock data with data from API
  const total = 10;
  const mockData =buildMockData(total);
  const isLoading = false;
  const isError = false;
  const isFetching = false;
  const isMoreError = false;
  const error = null;
  const loadMoreFunc = React.useCallback(() => {}, []);

  const {
    renderCard,
    selectedTags,
    tagList,
  } = useCardList();
  return (
    <>
      <CardList
        cardList={mockData.list}
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
        loadMoreFunc={loadMoreFunc}
        />
      <Toast
        open={isMoreError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
};

export default MyCollections;
