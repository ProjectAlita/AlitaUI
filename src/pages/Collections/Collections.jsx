import React, { useCallback } from 'react';
// import EmptyPromptList from '../PromptList/EmptyPromptList';
import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import Top from './Top';
import Latest from './Latest';
import MyLiked from './MyLiked';
import StickyTabs from '@/components/StickyTabs';
import { PromptsTabs, PUBLIC_PROJECT_ID } from '@/common/constants';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useSelector } from 'react-redux';
import { useCollectionListQuery } from '@/api/collections';


const Collections = () => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { tab = 'latest' } = useParams();
  const { query } = useSelector(state => state.search);
  const {
    data: collectionsData } = useCollectionListQuery({
      projectId: PUBLIC_PROJECT_ID,
      page: 0,
      params: {
        query,
      }
    });

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Collections}/${PromptsTabs[newTab]}`;
      navigate(pagePath,
        {
          state: locationState || {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.Collections]
            }]
          }
        });
    },
    [navigate, locationState],
  );
  const tabs = [{
    label: 'Top',
    icon: <Champion />,
    content: <Top />,
    display: 'none',
  }, {
    label: 'Latest',
    count: collectionsData?.total,
    icon: <Fire />,
    content: <Latest />
  }, {
    label: 'My liked',
    icon: <Star />,
    content: <MyLiked />,
    display: 'none',
  }];

  return (
    <StickyTabs tabs={tabs} value={PromptsTabs.findIndex(item => item === tab)} onChangeTab={onChangeTab} />
  )
}

export default Collections