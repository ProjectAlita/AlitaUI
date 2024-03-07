import Box from '@mui/material/Box';
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

const StyledTabBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderBottom: 1,
  borderColor: 'divider',
  width: '100%',
  backgroundColor: theme.palette.background.default,
}));

export const CustomTabs = styled(Tabs)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    width: 'auto',
  },
  marginRight: '2rem',
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

export const StyledTab = styled(Tab)(() => ({
  padding: '0.25rem 1.5rem',
  flex: '0 0 auto'
}));

const ToolBar = styled('div')(() => ({
  display: 'flex',
  flex: '1 0 auto',
  flexDirection: 'row-reverse'
}));

const PlaceHolder = styled('div')(() => ({
  flex: 1,
}));

export default function StyledTabs({ tabs = [], extraHeaders, tabSX }) {
  const [value, setValue] = React.useState(0);
  const tabBarItems = React.useMemo(() => tabs[value].tabBarItems, [tabs, value])
  const rightToolbar = React.useMemo(() => tabs[value].rightToolbar, [tabs, value])

  const handleChange = React.useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <div>
      <StyledTabBar sx={tabSX}>
        {
          extraHeaders
        }
        <Box sx={{ display: 'flex' }} >
          <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {tabs.map((tab, index) => (
              <StyledTab sx={{ display: tab.display }} label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} />
            ))}
          </CustomTabs>
          <ToolBar>
            {rightToolbar}
            <PlaceHolder />
            {tabBarItems}
          </ToolBar>
        </Box>
      </StyledTabBar>
      {tabs.map((tab, index) => (
        <CustomTabPanel style={{ display: tab.display }} value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </div>
  );
}

StyledTabs.propTypes = {
  tabs: PropTypes.array,
};