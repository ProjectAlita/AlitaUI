import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import CardList from '@/components/CardList';
import Toast from '@/components/Toast.jsx';
import useCardList from '@/components/useCardList';
import useTags from '@/components/useTags';
import { useViewMode } from '@/pages/hooks';
import * as React from 'react';
import { useSelector } from 'react-redux';
import RightPanel from './RightPanel';
import { useLoadDatasources } from './useLoadDatasources';

const EmptyListPlaceHolder = ({ query, viewMode, name }) => {
  if (!query) {
    if (viewMode !== ViewMode.Owner) {
      return <div>{`${name} has not created data source yet.`}</div>
    } else {
      return <div>You have not created data source yet. <br />Create yours now!</div>
    }
  } else {
    return <div>Nothing found. <br />Create yours now!</div>;
  }
};

const DataSourceList = ({
  rightPanelOffset,
  sortBy,
  sortOrder,
  statuses,
}) => {
  const viewMode = useViewMode();
  const {
    renderCard,
  } = useCardList(viewMode);
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const { name } = useSelector((state) => state.trendingAuthor.authorDetails);

  const {
    onLoadMorePublicDatasources,
    data,
    isDatasourcesError,
    isMoreDatasourcesError,
    isDatasourcesFirstFetching,
    isDatasourcesFetching,
    isDatasourcesLoading,
    datasourcesError,
  } = useLoadDatasources(viewMode, selectedTagIds, sortBy, sortOrder, statuses);

  const { rows: datasources = [], total } = data || {};

  const loadMoreCollections = React.useCallback(() => {
    const existsMore = datasources.length < total;
    if (!existsMore || isDatasourcesFetching) return;
    onLoadMorePublicDatasources();
  }, [datasources.length, total, isDatasourcesFetching, onLoadMorePublicDatasources]);

  return (
    <>
      <CardList
        key={'DataSourceList'}
        cardList={datasources}
        total={total}
        isLoading={isDatasourcesLoading || isDatasourcesFirstFetching}
        isError={isDatasourcesError}
        rightPanelOffset={rightPanelOffset}
        rightPanelContent={<RightPanel tagList={tagList} />}
        renderCard={renderCard}
        isLoadingMore={isDatasourcesFetching}
        loadMoreFunc={loadMoreCollections}
        cardType={viewMode === ViewMode.Owner ? ContentType.MyLibraryDatasources : ContentType.UserPublicDatasources}
        emptyListPlaceHolder={<EmptyListPlaceHolder viewMode={viewMode} name={name} />}
      />
      <Toast
        open={isMoreDatasourcesError}
        severity={'error'}
        message={buildErrorMessage(datasourcesError)}
      />
    </>
  );
};

export default DataSourceList;
