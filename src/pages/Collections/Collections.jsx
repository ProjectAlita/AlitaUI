import React, { useCallback } from 'react';
// import EmptyPromptList from '../PromptList/EmptyPromptList';
import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import Top from './Top';
import Latest from './Latest';
import MyLiked from './MyLiked';
import StickyTabs from '@/components/StickyTabs';
import { CollectionStatus, PromptsTabs, PUBLIC_PROJECT_ID } from '@/common/constants';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useTotalCollectionListQuery } from '@/api/collections';
import { useSelector } from 'react-redux';
import useTags from '@/components/useTags';


const Collections = () => {
  const navigate = useNavigate();
  const { query } = useSelector(state => state.search);
  const { state: locationState } = useLocation();
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList); 
  const { tab = 'latest' } = useParams();
  const {
    data: collectionsData } = useTotalCollectionListQuery({
      projectId: PUBLIC_PROJECT_ID,
      params: {
        query,
        tags: selectedTagIds,
        statuses: CollectionStatus.Published
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
    label: 'Latest',
    count: collectionsData?.total,
    icon: <Fire />,
    content: <Latest />
  }, {
    label: 'My liked',
    icon: <Star />,
    content: <MyLiked />,
    display: 'none',
  },{
    label: 'Trending',
    icon: <Champion />,
    content: <Top />,
    display: 'none',
  }, ];

  return (
    <StickyTabs tabs={tabs} value={PromptsTabs.findIndex(item => item === tab)} onChangeTab={onChangeTab} />
  )
}

export default Collections