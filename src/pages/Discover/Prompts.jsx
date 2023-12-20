import Champion from '@/components/Icons/Champion';
import Fire from '@/components/Icons/Fire';
import Star from '@/components/Icons/Star';
import Latest from '@/pages/PromptList/Latest';
import MyLiked from '@/pages/PromptList/MyLiked';
import StickyTabs from '../../components/StickyTabs';
import Top from '../PromptList/Top';
import { useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { PromptsTabs } from '@/common/constants';

export default function Prompts() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { tab = 'top' } = useParams();

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Prompts}/${PromptsTabs[newTab]}`;
      navigate(pagePath,
        {
          state: state || {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.Prompts]
            }]
          }
        });
    },
    [navigate, state],
  );
  
  const tabs = [{
    label: 'Top',
    icon: <Champion />,
    content:  <Top/>,
    display: 'none',
  }, {
    label: 'Latest',
    icon: <Fire />,
    content:  <Latest/>
  }, {
    label: 'My liked',
    icon: <Star />,
    content:  <MyLiked/>,
    display: 'none',
  }]

  return (
    <StickyTabs tabs={tabs} value={PromptsTabs.findIndex(item => item === tab)} onChangeTab={onChangeTab} />
  );
}