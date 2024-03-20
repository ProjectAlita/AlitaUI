import { SettingsPersonalProjectTabs, ViewMode } from '@/common/constants';
import PlusIcon from '@/components/Icons/PlusIcon';
import RouteDefinitions from '@/routes';
import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectId } from '../hooks';
import CommonIconButton from './components/CommonIconButton';
import FieldWithCopy from './components/Configuration/FieldWithCopy';
import IntegrationOptions from './components/Configuration/IntegrationOptions';
import Container from './components/Container';
import PersonalTokenTable from './components/PersonalTokenTable';
import ProjectTokenTable from './components/ProjectTokenTable';

const Configuration = () => {
  const theme = useTheme();
  const { state: locationState } = useLocation();
  const { routeStack = [] } = useMemo(() => (locationState || { routeStack: [] }), [locationState]);
  const projectId = useProjectId();
  const isTeamProject = false;

  const navigate = useNavigate();
  const user = useSelector(state => state.user)

  const onAddPersonalToken = useCallback(
    () => {
      const newRouteStack = [...routeStack];
      if (newRouteStack.length) {
        newRouteStack[newRouteStack.length - 1].pagePath = `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[1]}`
      }
      newRouteStack.push({
        breadCrumb: 'New personal token',
        viewMode: ViewMode.Owner,
        pagePath: RouteDefinitions.CreatePersonalToken,
      })
      navigate(
        {
          pathname: RouteDefinitions.CreatePersonalToken,
        },
        {
          replace: false,
          state: {
            routeStack: newRouteStack,
          },
        });
    },
    [navigate, routeStack],
  );

  return (
    <Container>
      <Box sx={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        'msOverflowStyle': 'none',
        '::-webkit-scrollbar': {
          width: '0 !important;',
          height: '0;',
        }
      }}>
        <Box sx={{ padding: '12px' }}>
          <Typography variant='subtitle'>
            General
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <FieldWithCopy label='URL' value={user.api_url} />
          <FieldWithCopy label='ProjectId' value={projectId} />
        </Box>
        <Box>
          <IntegrationOptions />
        </Box>
        <Box sx={{ paddingX: '12px', paddingY: '5px', marginTop: '32px', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant='subtitle'>
              personal tokens
            </Typography>
            <CommonIconButton onClick={onAddPersonalToken}>
              <PlusIcon fill={theme.palette.icon.fill.send} />
            </CommonIconButton>
          </Box>
        </Box>
        <Box sx={{ marginTop: '8px' }}>
          <PersonalTokenTable />
        </Box>
        {
          isTeamProject && <>
            <Box sx={{ paddingX: '12px', paddingY: '5px', marginTop: '32px', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography variant='subtitle'>
                  project tokens
                </Typography>
                <CommonIconButton onClick={onAddPersonalToken}>
                  <PlusIcon fill={theme.palette.icon.fill.send} />
                </CommonIconButton>
              </Box>
            </Box>
            <Box sx={{ marginTop: '8px' }}>
              <ProjectTokenTable />
            </Box>
          </>
        }
      </Box>
    </Container>
  );
}

export default Configuration;