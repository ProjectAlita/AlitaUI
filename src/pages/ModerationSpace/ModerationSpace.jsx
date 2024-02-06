import CommandIcon from '@/components/Icons/CommandIcon';
import FolderIcon from '@/components/Icons/FolderIcon';
import StickyTabs from '../../components/StickyTabs';
import AllStuffList from './AllStuffList';
import ModerationPromptList from './ModerationPromptList';
import ModerationCollectionList from './ModerationCollectionList';
import * as React from 'react';
import ViewToggle from '@/components/ViewToggle';
import { ModerationTabs } from '@/common/constants';
import RouteDefinitions from '@/routes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function ModerationSpace() {
  const [count, setCount] = React.useState(0);
  const [promptsCount, setPromptsCount] = React.useState(0);
  const [collectionCount, setCollectionCount] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { tab = ModerationSpace[0] } = useParams();

  const onChangeTab = React.useCallback(
    (newTab) => {
      const rootPath = RouteDefinitions.ModerationSpace;
      const pagePath = `${rootPath}/${ModerationTabs[newTab]}` + location.search;
      const { routeStack = [] } = state || {};
      navigate(pagePath, {
        state: {
          routeStack: routeStack,
        }
      });
    },
    [location.search, navigate, state],
  );

  const tabs = [{
    label: 'All',
    count: count,
    fullWidth: true,
    content: <AllStuffList setTabCount={setCount}/>,
  },{
    label: 'Prompts',
    count: promptsCount,
    fullWidth: true,
    icon: <CommandIcon/>,
    content: <ModerationPromptList setTabCount={setPromptsCount}/>,
  },{
    label: 'Collections',
    count: collectionCount,
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