import { typographyVariants } from '@/MainTheme';
import { CENTERED_CONTENT_BREAKPOINT, RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE } from '@/common/constants';
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

const TabsContainer = styled(Grid)(({ theme }) => ({
  marginBottom: '1rem',
  [theme.breakpoints.up('centered_content')]: {
    width: '2600px'
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

const MiddleArea = styled(Grid)(() => ({
  flexGrow: 1,
  display: 'flex',
  boxSizing: 'border-box',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  paddingRight: '10px',
  height: '35.5px',
}));

const RightPanel = styled(Grid)(() => ({
  width: RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  marginRight: '1.5rem',
  height: '35.5px',
  background: 'transparent',
}));

const ExtraHeaderBar = styled(Box)(({ theme }) => ({
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

export default function StickyTabs({ tabs = [], value = 0, extraHeader, middleTabComponent, rightTabComponent, onChangeTab }) {
  const handleChange = React.useCallback((_, newValue) => {
    onChangeTab(newValue);
  }, [onChangeTab]);

  return (
    <ResponsiveBox>
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
            <MiddleArea item >
              {middleTabComponent}
            </MiddleArea>
          }
          <RightPanel item >
            {
              rightTabComponent
            }
          </RightPanel>
        </TabsContainer>
      </FixedTabBar>
      <HeaderPlaceHolder hasHeader={extraHeader ? 'yes' : ''} />
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