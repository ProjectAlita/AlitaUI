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

export default function StyledTabs({tabs = []}) {
  const [value, setValue] = React.useState(0);

  const handleChange = React.useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <div>
      <StyledTabBar>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} 
              sx={{ padding: '0.25rem 1.5rem' }}/>
          ))}
        </Tabs>
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