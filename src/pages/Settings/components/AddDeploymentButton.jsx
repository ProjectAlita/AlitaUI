import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useTheme } from '@emotion/react';
import CommonIconButton from './CommonIconButton';
import PlusIcon from '@/components/Icons/PlusIcon';
import { MenuItem, Typography } from '@mui/material';
import DialIcon from '@/components/Icons/DialIcon';
import OpenAIIcon from '@/components/Icons/OpenAIIcon';
import HuggingFaceIcon from '@/components/Icons/HuggingFaceIcon';
import VertexAIIcon from '@/components/Icons/VertexAIIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import RouteDefinitions from '@/routes';
import { ViewMode, SettingsPersonalProjectTabs } from '@/common/constants';
import { CommonMenu } from './CommonMenu';
import { useGetAvailableIntegrationsQuery } from '@/api/integrations';
import { useSelectedProjectId } from '@/pages/hooks';
import AzureIcon from '@/components/Icons/AzureIcon';

const integrationMapping = {
  ai_dial: {
    aiType: 'ai_dial',
    icon: <DialIcon width={16} height={16} style={{ marginRight: '16px' }} />,
    title: 'AI Dial',
  },
  open_ai: {
    aiType: 'open_ai',
    icon: <OpenAIIcon width={16} height={16} style={{ marginRight: '16px' }} />,
    title: 'Open AI',
  },
  vertex_ai: {
    aiType: 'vertex_ai',
    icon: <VertexAIIcon width={16} height={16} style={{ marginRight: '16px' }} />,
    title: 'Vertex AI',
  },
  hugging_face: {
    aiType: 'hugging_face',
    icon: <HuggingFaceIcon width={16} height={16} style={{ marginRight: '16px' }} />,
    title: 'Hugging face',
  },
  open_ai_azure: {
    aiType: 'open_ai_azure',
    icon: <AzureIcon width={16} height={16} style={{ marginRight: '16px' }} />,
    title: 'Open AI Azure',
  }
};


const AddDeploymentButton = () => {
  const theme = useTheme();
  const projectId = useSelectedProjectId();
  const { data = [] } = useGetAvailableIntegrationsQuery(projectId, { skip: !projectId })
  const menuData = useMemo(() => {
    const foundItems = [];
    data.forEach(item => {
      if (integrationMapping[item]) {
        foundItems.push(integrationMapping[item]);
      }
    });
    return foundItems;
  }, [data]);

  const anchorRef = useRef(null);
  const [showActions, setShowActions] = useState(false);
  const { state: locationState } = useLocation();
  const { routeStack = [] } = useMemo(() => (locationState || { routeStack: [] }), [locationState]);
  const navigate = useNavigate();

  const onClickAdd = useCallback(
    () => {
      setShowActions(true);
    },
    [],
  )

  const onAdd = useCallback(
    (deploymentName) => () => {
      const newRouteStack = [...routeStack];
      if (newRouteStack.length) {
        newRouteStack[newRouteStack.length - 1].pagePath = `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[2]}`
      }
      newRouteStack.push({
        breadCrumb: 'New Deployment',
        viewMode: ViewMode.Owner,
        pagePath: RouteDefinitions.CreateDeployment,
      })
      navigate({
        pathname: RouteDefinitions.CreateDeployment,
        search: `deployment_name=${deploymentName}`
      },
        {
          state: {
            routeStack: newRouteStack,
          },
        })
    },
    [navigate, routeStack],
  )

  const onCloseMenu = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )

  return (
    <>
      <CommonIconButton onClick={onClickAdd} ref={anchorRef}>
        <PlusIcon fill={theme.palette.icon.fill.send} />
      </CommonIconButton>
      <CommonMenu
        id="create-integration-menu-list"
        aria-labelledby="create-integration-menu-button"
        anchorEl={anchorRef.current}
        open={showActions}
        onClose={onCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
          menuData.map(({ aiType, icon, title }) => (
            <MenuItem
              key={aiType}
              onClick={onAdd(aiType)}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: '8px 20px'
              }}
            >
              {icon}
              <Typography variant='labelMedium'>{title}</Typography>
            </MenuItem>
          ))
        }
      </CommonMenu>
    </>
  );
}

export default AddDeploymentButton;