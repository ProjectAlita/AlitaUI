import { buildErrorMessage } from '@/common/utils';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import IconButton from '@/components/IconButton';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import Tooltip from '@/components/Tooltip';
import { useFromMyLibrary, useProjectId, useViewMode } from '@/pages/hooks';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewMode } from '@/common/constants';
import HeaderContainer from '@/components/HeaderContainer';
import { useDeleteDatasourceMutation } from '@/api/datasources';
import useToast from '@/components/useToast';

export default function DataSourceDetailToolbar({ name }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const { datasourceId, } = useParams();
  const navigate = useNavigate();
  const [deleteDatasource, { isLoading, error, isError, isSuccess, reset }] = useDeleteDatasourceMutation();
  const isFromMyLibrary = useFromMyLibrary();
  const canDelete = useMemo(() => viewMode === ViewMode.Owner && isFromMyLibrary, [isFromMyLibrary, viewMode]);

  const onCloseToast = useCallback(() => {
    if (isError) {
      reset();
    } else if (isSuccess) {
      navigate(-1);
    }
  }, [isError, isSuccess, navigate, reset]);

  const { ToastComponent: Toast, toastInfo, toastError } = useToast(undefined, onCloseToast);

  const onDelete = useCallback(() => {
    setOpenAlert(true);
    setAlertTitle('Delete datasource');
    setAlertContent(`Are you sure to delete ${name}?`);
  }, [name]);

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );

  const onConfirmAlert = useCallback(
    async () => {
      onCloseAlert();
      await deleteDatasource({ projectId, datasourceId });
    },
    [deleteDatasource, onCloseAlert, projectId, datasourceId],
  );

  useEffect(() => {

  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
      reset();
    } else if (isSuccess) {
      toastInfo('Delete the datasource successfully');
    }
  }, [error, isError, isSuccess, reset, toastError, toastInfo]);

  return <>
    <HeaderContainer >
      {canDelete &&
        <Tooltip title='Delete datasource' placement='top'>
          <IconButton
            aria-label='delete data source'
            onClick={onDelete}
            disabled={isLoading}
          >
            <DeleteIcon sx={{ fontSize: '1rem' }} fill='white' />
            {isLoading && <StyledCircleProgress size={16} />}
          </IconButton>
        </Tooltip>
      }
    </HeaderContainer>
    <AlertDialog
      title={alertTitle}
      alertContent={alertContent}
      open={openAlert}
      onClose={onCloseAlert}
      onCancel={onCloseAlert}
      onConfirm={onConfirmAlert}
    />
    <Toast />
  </>
}
