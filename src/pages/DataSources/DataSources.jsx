import { CollectionStatus, PromptsTabs } from '@/common/constants';
import DateRangeSelect, { useTrendRange } from '@/components/DateRangeSelect';
import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import StickyTabs from '@/components/StickyTabs';
import ViewToggle from '@/components/ViewToggle';
import useTags from '@/components/useTags';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Latest from './Latest';
import MyLiked from './MyLiked';
import Trending from './Trending';
import { useTotalPublicDataSourcesQuery } from '@/api/datasources';


const DataSources = () => {
  const navigate = useNavigate();
  const { query } = useSelector(state => state.search);
  const location = useLocation();
  const { state: locationState } = location;
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const { tab = 'latest' } = useParams();
  const {
    trendRange,
  } = useTrendRange();

  const params = {
    query,
    tags: selectedTagIds,
    statuses: CollectionStatus.Published
  }

  const {
    data: latestData
  } = useTotalPublicDataSourcesQuery({
    params
  });

  const {
    data: myLikedData
  } = useTotalPublicDataSourcesQuery({
    params: {
      ...params,
      my_liked: true
    }
  });

  const {
    data: trendingData
  } = useTotalPublicDataSourcesQuery({
    params: {
      ...params,
      trend_start_period: trendRange
    }
  });

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.DataSources}/${PromptsTabs[newTab]}` + location.search;
      navigate(pagePath,
        {
          state: locationState ? {
            ...locationState,
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.DataSources]
            }],
            trendRange
          } : {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.DataSources]
            }]
          }
        });
    },
    [location.search, navigate, locationState, trendRange],
  );
  const tabs = [{
    label: 'Latest',
    count: latestData?.total,
    icon: <Fire />,
    content: <Latest />
  }, {
    label: 'My liked',
    count: myLikedData?.total,
    icon: <Star />,
    content: <MyLiked />,
  }, {
    label: 'Trending',
    count: trendingData?.total,
    icon: <Champion />,
    content: <Trending trendRange={trendRange} />,
  },];

  return (
    <StickyTabs
      tabs={tabs}
      value={PromptsTabs.findIndex(item => item === tab)}
      onChangeTab={onChangeTab}
      middleTabComponent={
        <>
          {
            tab === 'trending' &&
            <DateRangeSelect />
          }
          <ViewToggle />
        </>
      }
    />
  )
}

export default DataSources