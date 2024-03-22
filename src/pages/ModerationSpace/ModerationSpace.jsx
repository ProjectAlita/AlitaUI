import CommandIcon from '@/components/Icons/CommandIcon';
import FolderIcon from '@/components/Icons/FolderIcon';
import StickyTabs from '../../components/StickyTabs';
import AllStuffList from './AllStuffList';
import ModerationPromptList from './ModerationPromptList';
import ModerationCollectionList from './ModerationCollectionList';
import * as React from 'react';
import ViewToggle from '@/components/ViewToggle';
import { CollectionStatus, ModerationTabs, PUBLIC_PROJECT_ID, PromptStatus } from '@/common/constants';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTotalPromptsQuery } from '@/api/prompts';
import { useTotalCollectionListQuery } from '@/api/collections';

export default function ModerationSpace() {
  const [count, setCount] = React.useState(0);
  const [promptsCount, setPromptsCount] = React.useState(0);
  const [collectionCount, setCollectionCount] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { tab = ModerationSpace[0] } = useParams();

  const { data: promptsData } = useTotalPromptsQuery({
    projectId: PUBLIC_PROJECT_ID,
    params: {
      tags: [],
      sort_by: 'created_at',
      sort_order: 'desc',
      statuses: PromptStatus.OnModeration
    }
  });

  const { data: collectionData } = useTotalCollectionListQuery({
    projectId: PUBLIC_PROJECT_ID,
    params: {
      tags: [],
      sort_by: 'created_at',
      sort_order: 'desc',
      statuses: CollectionStatus.OnModeration
    }
  });

  const promptTotal = promptsData?.total;
  const collectionTotal = collectionData?.total
  const allTotal = promptTotal + collectionTotal;

  const onChangeTab = React.useCallback(
    (newTab) => {
      const rootPath = RouteDefinitions.ModerationSpace;
      const pagePath = `${rootPath}/${ModerationTabs[newTab]}` + location.search;
      navigate(pagePath, {
        state: {
          routeStack: [{
            pagePath,
            breadCrumb: PathSessionMap[RouteDefinitions.ModerationSpace]
          }],
        }
      });
    },
    [location.search, navigate],
  );

  const tabs = [{
    label: 'All',
    count: count || allTotal,
    fullWidth: true,
    content: <AllStuffList setTabCount={setCount}/>,
  },{
    label: 'Prompts',
    count: promptsCount || promptTotal,
    fullWidth: true,
    icon: <CommandIcon/>,
    content: <ModerationPromptList setTabCount={setPromptsCount}/>,
  },{
    label: 'Collections',
    count: collectionCount || collectionTotal,
    fullWidth: true,
    icon: <FolderIcon selected />,
    content: <ModerationCollectionList setTabCount={setCollectionCount}/>,
  }]

  return (
    <StickyTabs
      value={ModerationTabs.findIndex(item => item === tab)}
      tabs={tabs} 
      onChangeTab={onChangeTab} 
      noRightPanel
      middleTabComponent={
        <ViewToggle/>
      }
    />
  );
}