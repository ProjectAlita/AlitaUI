import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import { filterProps } from '@/common/utils';
import { RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE, CENTERED_CONTENT_BREAKPOINT } from '@/common/constants';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ReponsiveBox = styled(Box)(({ theme }) => ({
  width: '100%', 
  padding: '0 1.5rem 1rem 1.5rem',
  [theme.breakpoints.up('centered_content')]: {
    marginLeft: 'calc(50vw - 1325px)'
  }
}));

const FixedTabBar = styled(Grid)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  position: 'fixed',
  width: '100%',
  paddingRight: '1.5rem',
  backgroundColor: theme.palette.background.default,
  zIndex: 999,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.up('centered_content')]: {
    width: `${CENTERED_CONTENT_BREAKPOINT}px`
  }
}));

const TabsContainer = styled(Grid)(({theme}) => ({
  marginBottom: '1rem',
  [theme.breakpoints.up('centered_content')]: {
    width: '2600px'
  }
}));

const CustomTabs = styled(Tabs)(() => ({
  minHeight: '2rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  '& button': {
    minHeight: '1.875rem',
    textTransform: 'capitalize',
  },
  '& button>svg': {
    fontSize: '1rem',
  }
}));

const MiddleArea = styled(Grid)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  paddingRight: 14,
}));

const RightPanelPlaceHolder = styled(Grid)(() => ({
  width: RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE,
  boxSizing: 'content-box',
  paddingLeft: '1rem',
  marginLeft: '1rem',
  height: '100%',
  maxWidth: '25%',
  background: 'transparent'
}));

const ExtraHeaderBar = styled(Box)(({theme}) => ({
  height: '2.25rem', 
  display: 'flex', 
  alignItems: 'center',
  marginBottom: '0.5rem',
  width: '100%',
  justifyContent: 'space-between',
  paddingRight: '2rem',
  [theme.breakpoints.up('centered_content')]: {
    width: `${CENTERED_CONTENT_BREAKPOINT}px`
  }
}));

const HeaderPlaceHolder = styled(
  Box, 
  filterProps('hasHeader')
)(({ hasHeader }) => ({
  height: hasHeader ? '102px' : '52px',
}));

export default function StickyTabs({ tabs = [], value = 0, extraHeader, rightTabComponent, onChangeTab }) {
  const handleChange = React.useCallback((_, newValue) => {
    onChangeTab(newValue);
  }, [onChangeTab]);

  return (
    <ReponsiveBox>
      <FixedTabBar container>
        {extraHeader &&
          <ExtraHeaderBar>
            {extraHeader}
          </ExtraHeaderBar>
        }
        <TabsContainer container>
          <Grid item>
            <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
              {tabs.map((tab, index) => (
                <Tab sx={{display: tab.display}} label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} />
              ))}
            </CustomTabs>
          </Grid>
          <MiddleArea item>
            {
              rightTabComponent
            }
          </MiddleArea>
          <RightPanelPlaceHolder item />
        </TabsContainer>
      </FixedTabBar>
      <HeaderPlaceHolder hasHeader={extraHeader ? 'yes' : ''} />
      {tabs.map((tab, index) => (
        <CustomTabPanel style={{display: tab.display}}  value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </ReponsiveBox>
  );
}

StickyTabs.propTypes = {
  tabs: PropTypes.array,
};