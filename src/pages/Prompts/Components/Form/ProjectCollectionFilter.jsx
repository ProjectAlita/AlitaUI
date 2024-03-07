import {
  Box,
} from '@mui/material';
import * as React from 'react';
import { useTheme } from '@emotion/react';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import CloseEyeIcon from '@/components/Icons/CloseEyeIcon';
import OpenEyeIcon from '@/components/Icons/OpenEyeIcon';
import { CustomTabs, StyledTab } from '@/components/StyledTabs';

const ProjectCollectionFilter = ({ tab, onChangeTab }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      height: '56px',
      width: '100%',
      paddingInline: '12px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.border.lines}`
    }}
    >
      <CustomTabs
        value={tab}
        onChange={onChangeTab}
        aria-label="icon position tabs example"
      >
        <StyledTab icon={<CloseEyeIcon />} iconPosition="start" label="Private" />
        <StyledTab icon={<OpenEyeIcon />} iconPosition="start" label="Public" />
      </CustomTabs>
      <ProjectSelect
        label={'Project'}
        customSelectedColor={`${theme.palette.text.secondary} !important`}
        showMode={ProjectSelectShowMode.CompactMode}
        selectSX={{
          margin: '8px 0 0 0 !important',
        }}
        labelSX={{ paddingLeft: '0px' }}
        inputSX={{
          '& .MuiSelect-select': {
            paddingLeft: '12px'
          }
        }}
      />
    </Box>
  );
};

export default ProjectCollectionFilter;