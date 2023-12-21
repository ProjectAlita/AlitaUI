import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { PromptDetailSkeleton } from './Common';
import * as React from 'react';
import RunTab from './RunTab';
import CreateModeRunTabBarItems from './CreateModeRunTabBarItems';
import EditModeRunTabBarItems from './EditModeRunTabBarItems';
import ModeratorRunTabBarItems from './ModeratorRunTabBarItems';
import EditModeToolBar from './EditModeToolBar';
import ModeratorToolBar from './ModeratorToolBar';
import RocketIcon from '@/components/Icons/RocketIcon';
import { PromptView } from '@/common/constants';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
}))

export default function EditPromptTabs({ mode, isLoading }) {
  const tabBarItemsMap = {
    [PromptView.CREATE]: <CreateModeRunTabBarItems />,
    [PromptView.EDIT]: <EditModeRunTabBarItems />,
    [PromptView.MODERATE]: <ModeratorRunTabBarItems />
  }
  const rightToolBarMap = {
    [PromptView.CREATE]: null,
    [PromptView.EDIT]: <EditModeToolBar />,
    [PromptView.MODERATE]: <ModeratorToolBar />
  }
  return <React.Fragment>
    <Grid container sx={{ padding: '0.5rem 1.5rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12}>
        <StyledTabs
          tabs={[{
            label: 'Run',
            icon: <RocketIcon/>,
            tabBarItems: tabBarItemsMap[mode],
            rightToolbar: rightToolBarMap[mode],
            content:
              <TabContentDiv>
                {isLoading ? <PromptDetailSkeleton /> : <RunTab isCreateMode={mode===PromptView.CREATE} />}
              </TabContentDiv>,
          }, {
            label: 'Test',
            tabBarItems: null,
            content:
              <TabContentDiv>Test</TabContentDiv>,
            display: 'none',
          }]}
        />
      </Grid>
    </Grid>
  </React.Fragment>
}
