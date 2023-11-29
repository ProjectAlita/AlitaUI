import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import isPropValid from '@emotion/is-prop-valid';

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

const FixedTabBar = styled(Grid)(({ theme }) => ({
  borderBottom: 1,
  borderColor: 'divider',
  position: 'fixed',
  width: 'calc(100% - 4rem)',
  backgroundColor: theme.palette.background.default,
  paddingTop: '0.5rem',
  zIndex: 999,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
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
}));

const RightPlaceHolder = styled(Grid)(() => ({
  width: '16.5rem',
  boxSizing: 'content-box',
  paddingLeft: '1rem',
  marginLeft: '1rem',
  height: '100%',
  maxWidth: '25%',
  background: 'transparent'
}));

const ExtraHeaderBar = styled(Box)(() => ({
  height: '2rem', 
  display: 'flex', 
  alignItems: 'center',
  marginBottom: '0.5rem',
  width: '100%',
  justifyContent: 'space-between',
}));

const HeaderPlaceHolder = styled(Box, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'hasHeader'
})(({ hasHeader }) => ({
  height: hasHeader ? '6.2rem' : '3.2rem',
}));

export default function StickyTabs({ tabs = [], defaultValue = 0, extraHeader, rightTabComponent }) {
  const [value, setValue] = React.useState(defaultValue);
  const handleChange = React.useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <Box sx={{ width: '100%', padding: '0 1.5rem 1rem 1.5rem' }}>
      <FixedTabBar container>
        {extraHeader &&
          <ExtraHeaderBar>
            {extraHeader}
          </ExtraHeaderBar>
        }
        <Grid container>
          <Grid item>
            <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
              {tabs.map((tab, index) => (
                <Tab label={tab.label} icon={tab.icon} iconPosition="start" key={index} {...a11yProps(index)} />
              ))}
            </CustomTabs>
          </Grid>
          <MiddleArea item>
            {
              rightTabComponent
            }
          </MiddleArea>
          <RightPlaceHolder item />
        </Grid>
      </FixedTabBar>
      <HeaderPlaceHolder hasHeader={extraHeader ? 'yes' : ''} />
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