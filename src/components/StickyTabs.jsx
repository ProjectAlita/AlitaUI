import { typographyVariants } from '@/MainTheme';
import { CENTERED_CONTENT_BREAKPOINT, CARD_LIST_WIDTH, CARD_LIST_WIDTH_CENTERED } from '@/common/constants';
import { filterProps } from '@/common/utils';
import { Badge } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';

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

const ResponsiveBox = styled(Box)(({ theme }) => ({
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
  width: 'calc(100% - 48px)',
  marginRight: '0',
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

const TabsContainer = styled(Grid)(({ theme }) => ({
  minWidth: '520px',
  marginBottom: '1rem',
  flexWrap: 'nowrap',
  [theme.breakpoints.up('centered_content')]: {
    width: CARD_LIST_WIDTH_CENTERED
  }
}));

const CustomTabs = styled(Tabs)(() => ({
  minHeight: '2rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  height: '35.5px',
  '& button': {
    minHeight: '1.875rem',
    textTransform: 'capitalize',
  },
  '& button>svg': {
    fontSize: '1rem',
  }
}));

const MiddleArea = styled(Grid,
  filterProps('noRightPanel'))(({ noRightPanel }) => ({
    flexGrow: 1,
    display: 'flex',
    boxSizing: 'border-box',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: !noRightPanel ? '16px' : '0px',
    height: '35.5px',
  }));

const HeaderPlaceHolder = styled(
  Box,
)(() => ({
  height: '51px',
}));

const CountBadge = styled(Badge)(({ theme }) => ({
  height: '8px',
  width: '16px',
  '& .MuiBadge-badge': {
    ...typographyVariants.labelSmall,
    color: theme.palette.text.secondary,
    height: '16px',
    minWidth: '16px',
    borderRadius: '8px',
    padding: '0px 4.5px',
  }
}));

export default function StickyTabs({
  tabs = [],
  value = 0,
  middleTabComponent,
  onChangeTab,
  tabBarStyle,
  containerStyle,
  tabsContainerStyle,
  noRightPanel
}) {
  const handleChange = React.useCallback((_, newValue) => {
    onChangeTab(newValue);
  }, [onChangeTab]);

  return (
    <ResponsiveBox sx={containerStyle}>
      <FixedTabBar sx={tabBarStyle} container>
        <TabsContainer container sx={{ ...tabsContainerStyle, width: tabs[value]?.fullWidth ? '100%' : CARD_LIST_WIDTH }}>
          <Grid item>
            <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
              {tabs.map((tab, index) => (
                <Tab
                  sx={{ display: tab.display }}
                  label={
                    <div>
                      <span>{tab.label}</span>
                      {tab.count > 0 &&
                        <CountBadge
                          component='div'
                          badgeContent={tab.count}
                          color={'info'}
                        />
                      }
                    </div>
                  }
                  icon={tab.icon}
                  iconPosition="start"
                  key={index}
                  {...a11yProps(index)}
                />
              ))}
            </CustomTabs>
          </Grid>
          {
            middleTabComponent &&
            <MiddleArea noRightPanel={noRightPanel} item >
              {middleTabComponent}
            </MiddleArea>
          }
        </TabsContainer>
      </FixedTabBar>
      <HeaderPlaceHolder />
      {tabs.map((tab, index) => (
        <CustomTabPanel style={{ display: tab.display }} value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </ResponsiveBox>
  );
}

StickyTabs.propTypes = {
  tabs: PropTypes.array,
};