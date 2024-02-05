import CommandIcon from '@/components/Icons/CommandIcon';
import StickyTabs from '../../components/StickyTabs';
import RequestToPublish from './RequestToPublish';
import * as React from 'react';
import ViewToggle from '@/components/ViewToggle';

export default function ModerationSpace() {
  const [count, setCount] = React.useState(0);

  const tabs = [{
    label: 'Request To Publish',
    count: count,
    fullWidth: true,
    icon: <CommandIcon/>,
    content: <RequestToPublish setTabCount={setCount}/>,
  }]

  return (
    <StickyTabs 
      tabs={tabs} 
      // eslint-disable-next-line react/jsx-no-bind
      onChangeTab={() =>{}} 
      noRightPanel
      middleTabComponent={
        <ViewToggle/>
      }
    />
  );
}