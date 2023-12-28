/* eslint-disable no-unused-vars */
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Categories from '@/components/Categories';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useViewModeFromUrl } from '../hooks';
import AuthorInformation from '@/components/AuthorInformation';


const EmptyListPlaceHolder = ({ query, viewMode, name }) => {
  if (!query) {
    if (viewMode !== ViewMode.Owner) {
      return <div>{`${name} has not created sources yet.`}</div>
    } else {
      return <div>You have not created sources yet. <br />Create yours now!</div>
    }
  } else {
    return <div>Nothing found. <br />Create yours now!</div>;
  }
};

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

  const isDataSourcesError = false;
  const data = [];
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);

  const { tagList } = useSelector((state) => state.prompts);

  const onLoadMore = React.useCallback(() => { }, []);

  return (
    <>
      <CardList
        cardList={[]}
        isLoading={false}
        isError={null}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={
          <>
            <Categories tagList={[]}  title='Tags'  style={{ height: '232px' }} />
            <AuthorInformation
              isLoading={false}
            />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        loadMoreFunc={onLoadMore}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryDatasources : ContentType.UserPublicDatasources}
        emptyListPlaceHolder={<EmptyListPlaceHolder viewMode={viewMode} name={name} />}
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
