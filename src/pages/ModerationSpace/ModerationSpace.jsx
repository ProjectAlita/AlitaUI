import CommandIcon from '@/components/Icons/CommandIcon';
import StickyTabs from '../../components/StickyTabs';
import RequestToPublish from './RequestToPublish';
import useTabs from '@/components/useTabs';

export default function Prompts() {
  const { tabItemCounts, setCount } = useTabs();
  
  const tabs = [{
    label: 'Request To Publish',
    count: tabItemCounts[0],
    icon: <CommandIcon/>,
    content:  <RequestToPublish tabIndex={0} setTabCount={setCount}/>,
  }]

  return (
    <StickyTabs 
      tabs={tabs} 
      // eslint-disable-next-line react/jsx-no-bind
      onChangeTab={() =>{}} 
    />
  );
}