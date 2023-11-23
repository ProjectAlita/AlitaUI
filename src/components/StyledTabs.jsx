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

const StyledTabBar = styled(Box)(({theme}) => ({
  borderBottom: 1, 
  borderColor: 'divider', 
  width: '100%',
  backgroundColor: theme.palette.background.default,
}));



const CustomTabs = styled(Tabs)(({theme}) => ({
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  },
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

export default function StyledTabs({tabs = []}) {
  const [value, setValue] = React.useState(0);
  const [tabBarItems, setTabBarItems] = React.useState(tabs[0].tabBarItems);

  const handleChange = React.useCallback((_, newValue) => {
    setValue(newValue);
    setTabBarItems(tabs[newValue].tabBarItems);
  }, [tabs]);

  return (
    <div>
      <StyledTabBar>
        <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} 
              sx={{ padding: '0.25rem 1.5rem', flex: '0 0 auto' }}/>
          ))}
          <div style={{ display: 'flex', flex: '1 0 auto', flexDirection: 'row-reverse' }}>
            {tabBarItems}
          </div>
        </CustomTabs>
      </StyledTabBar>
      {tabs.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </div>
  );
}

StyledTabs.propTypes = {
  tabs: PropTypes.array,
};