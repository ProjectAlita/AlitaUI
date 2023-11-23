import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { PromptDetailSkeleton } from './Common';
import * as React from 'react';
import EditPromptDetail from './EditPromptDetail';
import CreateModeRunTabBarItems from './CreateModeRunTabBarItems';
import EditModeRunTabBarItems from './EditModeRunTabBarItems';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export default function EditPromptTabs({ isCreateMode, isLoading }) {
  return <React.Fragment>
    <Grid container sx={{ padding: '0.5rem 1.5rem', position: 'fixed', marginTop: '0.7rem'  }}>
      <Grid item xs={12}>
        <StyledTabs tabs={[{
          label: 'Run',
          tabBarItems: isCreateMode ? <CreateModeRunTabBarItems/> : <EditModeRunTabBarItems/>,
          content: 
            <TabContentDiv>
              {isLoading ? <PromptDetailSkeleton/> : <EditPromptDetail isCreateMode={isCreateMode} />}
            </TabContentDiv>,
        }, {
          label: 'Test',
          tabBarItems: null,
          content: 
            <TabContentDiv>Test</TabContentDiv>
        }]}/>
      </Grid>
    </Grid>
  </React.Fragment>
}
