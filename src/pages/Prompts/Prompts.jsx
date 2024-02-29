import { useTotalMyLikedPublicPromptsQuery, useTotalPublicPromptsQuery, useTotalTrendingPublicPromptsQuery } from '@/api/prompts';
import { PromptsTabs } from '@/common/constants';
import DateRangeSelect, { useTrendRange } from '@/components/DateRangeSelect';
import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import ViewToggle from '@/components/ViewToggle';
import useTags from '@/components/useTags';
import Latest from '@/pages/Prompts/Latest';
import MyLiked from '@/pages/Prompts/MyLiked';
import Trending from '@/pages/Prompts/Trending';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StickyTabs from '@/components/StickyTabs';

export default function Prompts() {
  const navigate = useNavigate();
  const { query } = useSelector(state => state.search);
  const { state: locationState } = useLocation();
  const { tab = PromptsTabs[0] } = useParams();
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const {
    trendRange,
  } = useTrendRange();

  const { data } = useTotalPublicPromptsQuery({
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
    }
  });

  const { data: myLikedData } = useTotalMyLikedPublicPromptsQuery({
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
      my_liked: true,
    }
  });

  const { data: trendingData } = useTotalTrendingPublicPromptsQuery({
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
      trend_start_period: trendRange,
    }
  });

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Prompts}/${PromptsTabs[newTab]}` + location.search;
      navigate(pagePath, {
        state: locationState ? {
          ...locationState,
          trendRange
        } : {
          routeStack: [{
            pagePath,
            breadCrumb: PathSessionMap[RouteDefinitions.Prompts]
          }]
        }
      });
    },
    [navigate, locationState, trendRange],
  );

  const tabs = useMemo(() => [{
    label: 'Latest',
    count: data?.total,
    icon: <Fire />,
    content: <Latest />
  }, {
    label: 'My liked',
    icon: <Star />,
    content: <MyLiked />,
    count: myLikedData?.total,
  }, {
    label: 'Trending',
    icon: <Champion />,
    content: <Trending trendRange={trendRange} />,
    count: trendingData?.total,
  }], [data?.total, myLikedData?.total, trendRange, trendingData?.total]);

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
  );
}