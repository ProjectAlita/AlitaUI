import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import Latest from '@/pages/PromptList/Latest';
import MyLiked from '@/pages/PromptList/MyLiked';
import StickyTabs from '../../components/StickyTabs';
import Box from '@mui/material/Box';
import { useCallback, useState, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { ALL_TIME_DATE, PromptsTabs } from '@/common/constants';
import { useTotalMyLikedPublicPromptsQuery, useTotalPublicPromptsQuery, useTotalTrendingPublicPromptsQuery } from '@/api/prompts';
import { useSelector } from 'react-redux';
import useTags from '@/components/useTags';
import SingleSelect from '../../components/SingleSelect';
import { useTheme } from '@emotion/react';
import Trending from '@/pages/PromptList/Trending';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  height: 100%;
`));

export default function Prompts() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { query } = useSelector(state => state.search);
  const { state: locationState } = useLocation();
  const { tab = 'latest' } = useParams();
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const [trendRange, setTrendRange] = useState(ALL_TIME_DATE);
  const trendRangeOptions = useMemo(() => {
    const theDate = new Date();
    const dateString = theDate.toISOString().split('T')[0];
    const monthString = dateString.substring(0, dateString.lastIndexOf('-'));
    const firstDataOfThisWeek = theDate.getDate() - theDate.getDay();
    const theDateOfMonday = new Date(new Date().setDate(firstDataOfThisWeek)).toISOString().split('T')[0]
    return [
      {
        label: 'Today',
        value: dateString + 'T00:00:00'
      },
      {
        label: 'This week',
        value: theDateOfMonday + 'T00:00:00',
      },
      {
        label: 'This Month',
        value: monthString + '-01T00:00:00',
      },
      {
        label: 'All time',
        value: ALL_TIME_DATE,
      }
    ]
  }, []);

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
      trend_start_period: trendRange === ALL_TIME_DATE ? undefined : trendRange,
    }
  });

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Prompts}/${PromptsTabs[newTab]}`;
      navigate(pagePath,
        {
          state: locationState || {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.Prompts]
            }]
          }
        });
    },
    [navigate, locationState],
  );

  const onChangeTrendRange = useCallback(
    (newRange) => {
      setTrendRange(newRange);
    },
    [],
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
    content: <Trending trendRange={trendRange}/>,
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
            <SelectContainer>
              <SingleSelect
                onValueChange={onChangeTrendRange}
                value={trendRange}
                options={trendRangeOptions}
                customSelectedColor={`${theme.palette.text.primary} !important`}
                customSelectedFontSize={'0.875rem'}
              />
            </SelectContainer>
          }
        </>
      }
    />
  );
}