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
import { useTotalPublicPromptsQuery } from '@/api/prompts';
import { useSelector } from 'react-redux';
import useTags from '@/components/useTags';

export default function Prompts() {
  const navigate = useNavigate();
  const { query } = useSelector(state => state.search);
  const { state: locationState } = useLocation();
  const { tab = 'latest' } = useParams();
  const { tagList } = useSelector((state) => state.prompts);
  const { selectedTagIds } = useTags(tagList);
  const { data } = useTotalPublicPromptsQuery({
    params: {
      tags: selectedTagIds,
      sort_by: 'created_at',
      sort_order: 'desc',
      query,
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

  const tabs = [{
    label: 'Top',
    icon: <Champion />,
    content: <Top />,
    display: 'none',
  }, {
    label: 'Latest',
    count: data?.total,
    icon: <Fire />,
    content: <Latest />
  }, {
    label: 'My liked',
    icon: <Star />,
    content: <MyLiked />,
    display: 'none',
  }]

  return (
    <StickyTabs tabs={tabs} value={PromptsTabs.findIndex(item => item === tab)} onChangeTab={onChangeTab} />
  );
}