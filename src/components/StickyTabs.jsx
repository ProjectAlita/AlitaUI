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

const FixedTabBar = styled(Box)(({theme}) => ({
  borderBottom: 1, 
  borderColor: 'divider', 
  position: 'fixed',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  paddingTop: '1rem',
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

export default function StickyTabs({tabs = []}) {
  const [value, setValue] = React.useState(0);

  const handleChange = React.useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <Box sx={{ width: '100%', padding: '0 1.5rem 1rem 1.5rem'}}>
      <FixedTabBar>
        <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} />
          ))}
        </CustomTabs>
      </FixedTabBar>
      <div style={{height: '3.5rem'}}/>
      {tabs.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  );
}

StickyTabs.propTypes = {
  tabs: PropTypes.array,
};