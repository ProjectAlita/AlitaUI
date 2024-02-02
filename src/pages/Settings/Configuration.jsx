import React, { useCallback, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CopyIcon from '@/components/Icons/CopyIcon';
import { useTheme } from '@emotion/react';
import PlusIcon from '@/components/Icons/PlusIcon';
import PersonalTokenTable from './components/PersonalTokenTable';
import { handleCopy } from '@/common/utils';
import Toast from '@/components/Toast.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { SettingsPersonalProjectTabs, ViewMode } from '@/common/constants';
import RouteDefinitions from '@/routes';
import CommonIconButton from './components/CommonIconButton';
import Container from './components/Container';
import ProjectTokenTable from './components/ProjectTokenTable';


const Configuration = () => {
  const theme = useTheme();
  const { state: locationState } = useLocation();
  const { routeStack = [] } = useMemo(() => (locationState || { routeStack: [] }), [locationState]);
  const isTeamProject = false;

  const navigate = useNavigate();
  const user = useSelector(state => state.user)
  const [openToast, setOpenToast] = useState(false);

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

  const onCopy = useCallback(() => {
    handleCopy(user.api_url)
    setOpenToast(true);
  }, [user.api_url]);

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
  }, []);

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
        <Box sx={{ paddingX: '12px', paddingY: '8px', borderBottom: `1px solid ${theme.palette.border.lines}`, width: '50%' }}>
          <Typography variant='bodySmall'>
            URL
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant='bodyMedium'>
              {user.api_url}
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={onCopy}>
              <CopyIcon sx={{ fontSize: '16px' }} />
            </Box>
            <Toast
              open={openToast}
              severity={'info'}
              message={'The url is copied to clipboard'}
              onClose={onCloseToast}
            />
          </Box>
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