import React, {useCallback} from 'react';
// import EmptyPromptList from '../PromptList/EmptyPromptList';
import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import Top from './Top';
import Latest from './Latest';
import MyLiked from './MyLiked';
import StickyTabs from '@/components/StickyTabs';
import { PromptsTabs } from '@/common/constants';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '@/routes';


const Collections = () => {
    const navigate = useNavigate();
  const { state } = useLocation();
  const { tab = 'latest' } = useParams();

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Collections}/${PromptsTabs[newTab]}`;
      navigate(pagePath,
        {
          state: state || {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.Collections]
            }]
          }
        });
    },
    [navigate, state],
  );
    const tabs = [{
        label: 'Top',
        icon: <Champion />,
        content: <Top />,
        display: 'none',
    }, {
        label: 'Latest',
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