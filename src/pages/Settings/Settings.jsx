import { SettingsPersonalProjectTabs } from '@/common/constants';
import GearIcon from '@/components/Icons/GearIcon';
import IntegrationIcon from '@/components/Icons/IntegrationIcon';
import UserIcon from '@/components/Icons/UserIcon.jsx';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useTheme } from '@emotion/react';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StickyTabs from '../../components/StickyTabs';
import ProjectSelect from '../MyLibrary/ProjectSelect';
import Configuration from './Configuration';
import Deployments from './Deployments';
import Profile from './Profile';

export default function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state: locationState } = useLocation();
  const { tab = 'latest' } = useParams();
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[newTab]}`;
      navigate(pagePath,
        {
          state: locationState || {
            routeStack: [{
              pagePath,
              breadCrumb: PathSessionMap[RouteDefinitions.Settings]
            }]
          }
        });
    },
    [navigate, locationState],
  );

  const tabs = useMemo(() => [{
    label: 'Profile',
    icon: <UserIcon />,
    content: <Profile />,
    fullWidth: true,
  }, {
    label: 'Configuration',
    icon: <GearIcon />,
    content: <Configuration />,
    fullWidth: true,
  }, {
    label: 'Deployments',
    icon: <IntegrationIcon />,
    content: <Deployments />,
    fullWidth: true,
  }], []);

  return (
    <StickyTabs
      tabs={tabs}
      noRightPanel
      tabBarStyle={{ width: '100% !important', padding: '0 1.5rem 0 1.5rem', borderBottom: `1px solid ${theme.palette.secondary.main}` }}
      containerStyle={{ padding: '0 0 1rem 0' }}
      value={SettingsPersonalProjectTabs.findIndex(item => item === tab)}
      onChangeTab={onChangeTab}
      middleTabComponent={
        privateProjectId && <ProjectSelect customSelectedColor={theme.palette.text.secondary} />
      }
    />
  );
}