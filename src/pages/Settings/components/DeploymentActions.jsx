import React, { useCallback, useState, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import AlertDialog from '@/components/AlertDialog';
import DotsMenuIcon from '@/components/Icons/DotsMenuIcon';
import { useTheme } from '@emotion/react';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@/components/Icons/EditIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import SuccessIcon from '@/components/Icons/SuccessIcon';
import { useDeleteDeploymentMutation, useMakeDeploymentDefaultMutation } from '@/api/integrations.js';
import Toast from '../../../components/Toast';
import { buildErrorMessage } from '@/common/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import RouteDefinitions from '@/routes';
import { ViewMode, SettingsPersonalProjectTabs, SearchParams } from '@/common/constants';
import { CommonMenu } from './CommonMenu';
import { useProjectId } from '@/pages/hooks';


const DeploymentActions = ({ deployment, refetch }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { routeStack = [] } = useMemo(() => (locationState || { routeStack: [] }), [locationState]);
  const projectId = useProjectId();
  const anchorRef = useRef(null);
  const [deleteDeployment] = useDeleteDeploymentMutation();
  const [makeDefaultDeployment] = useMakeDeploymentDefaultMutation();

  const [showActions, setShowActions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('info');
  const [toastMessage, setToastMessage] = useState('');
  const shouldDisableActions = useMemo(() => deployment.project_id !== projectId && deployment.is_default, [deployment.is_default, deployment.project_id, projectId])
  const onClickDelete = useCallback(
    () => {
      setShowActions(false);
      setOpenAlert(true);
    },
    [],
  )

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );
  const onConfirmAlert = useCallback(
    async () => {
      onCloseAlert();
      if (!isProcessing) {
        setIsProcessing(true);
        const { error } = await deleteDeployment({ projectId, id: deployment.id })
        if (!error) {
          await refetch();
          setOpenToast(true);
          setToastMessage('The deployment has been deleted');
          setToastSeverity('info');
        } else {
          setOpenToast(true);
          setToastMessage(error?.status === 403 ? 'The action is not allowed' : buildErrorMessage(error));
          setToastSeverity('error');
        }
        setIsProcessing(false);
      }
    }, [onCloseAlert, isProcessing, deleteDeployment, projectId, deployment.id, refetch]);

  const onClickActions = useCallback(
    () => {
      if (!shouldDisableActions) {
        setShowActions(true);
      }
    },
    [shouldDisableActions],
  )

  const onCloseMenu = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )

  const onEditAction = useCallback(
    () => {
      setShowActions(false);
      const newRouteStack = [...routeStack];
      if (newRouteStack.length) {
        newRouteStack[newRouteStack.length - 1].pagePath = `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[2]}`
      }
      const pagePath = `${RouteDefinitions.EditDeployment.replace(':uid', deployment.uid)}`;
      newRouteStack.push({
        breadCrumb: deployment.config.name,
        viewMode: ViewMode.Owner,
        pagePath: pagePath,
      })
      navigate({
        pathname: pagePath,
        search: `${SearchParams.DeploymentName}=${deployment.name}&${SearchParams.DeploymentConfigName}=${deployment.config.name}`
      },
        {
          state: {
            routeStack: newRouteStack,
          },
        })
    },
    [deployment.config.name, deployment.name, deployment.uid, navigate, routeStack],
  )

  const onMakeItDefaultAction = useCallback(
    async () => {
      setShowActions(false);
      if (!isProcessing) {
        setIsProcessing(true);
        const { error } = await makeDefaultDeployment({ projectId, id: deployment.id, is_shared: deployment.config.is_shared })
        if (!error) {
          await refetch();
          setOpenToast(true);
          setToastMessage('The deployment has been set as default');
          setToastSeverity('success');
        } else {
          setOpenToast(true);
          setToastMessage(buildErrorMessage(error));
          setToastSeverity('error');
        }
        setIsProcessing(false);
      }

    },
    [deployment.config.is_shared, deployment.id, isProcessing, makeDefaultDeployment, projectId, refetch],
  )

  const onCloseToast = useCallback(
    () => {
      setOpenToast(false);
    },
    [],
  )

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <Box
          ref={anchorRef}
          sx={{
            cursor: shouldDisableActions ? undefined : 'pointer',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '24px',
            width: '24px',
            borderRadius: '6px',
            ':hover': {
              background: shouldDisableActions ? undefined : theme.palette.background.tabButton.active
            }
          }}
          onClick={onClickActions}>
          <DotsMenuIcon sx={{ fontSize: '16px' }} fill={shouldDisableActions ? theme.palette.icon.fill.disabled : theme.palette.icon.fill.default} />
          {
            isProcessing && <StyledCircleProgress size={16} />
          }
        </Box>
        <CommonMenu
          id="header-split-menu-list"
          aria-labelledby="header-split-menu-button"
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
          {deployment.project_id === projectId && <MenuItem
            onClick={onEditAction}
            sx={{
              justifyContent: 'flex-start',
              padding: '8px 20px'
            }}
          >
            <EditIcon sx={{ width: '16px', height: '16px', marginRight: '12px' }} />
            <Typography variant='labelMedium'>Edit</Typography>
          </MenuItem>}
          {
            !deployment.is_default && <MenuItem
              onClick={onMakeItDefaultAction}
              sx={{
                justifyContent: 'flex-start',
                padding: '8px 20px'
              }}
            >
              <Box sx={{ width: '18px', height: '18px', marginRight: '12px' }} >
                <SuccessIcon width={'18px'} height={'18px'} />
              </Box>
              <Typography variant='labelMedium'>Set as default</Typography>
            </MenuItem>
          }
          {deployment.project_id === projectId && <MenuItem
            onClick={onClickDelete}
            sx={{
              justifyContent: 'flex-start',
              padding: '8px 20px'
            }}
          >
            <DeleteIcon sx={{ width: '16px', height: '16px', marginRight: '12px' }} />
            <Typography variant='labelMedium'>Delete</Typography>
          </MenuItem>}
        </CommonMenu>
      </Box>
      <AlertDialog
        title={'Delete deployment'}
        alertContent={"The deleted deployment can't be restored, are you sure to delete it?"}
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmAlert}
      />
      <Toast
        open={openToast}
        severity={toastSeverity}
        message={toastMessage}
        onClose={onCloseToast}
      />
    </>
  )
}

export default DeploymentActions;
