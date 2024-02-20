import { buildErrorMessage } from '@/common/utils';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import IconButton from '@/components/IconButton';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import Toast from '@/components/Toast';
import Tooltip from '@/components/Tooltip';
import { useFromMyLibrary, useProjectId, useViewMode } from '@/pages/hooks';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewMode } from '@/common/constants';
import HeaderContainer from '@/components/HeaderContainer';
import { useDeleteDatasourceMutation } from '@/api/datasources';

export default function DataSourceDetailToolbar({ name }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const { datasourceId, } = useParams();
  const navigate = useNavigate();
  const [deleteDatasource, { isLoading, error, isError, isSuccess, reset }] = useDeleteDatasourceMutation();
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const isFromMyLibrary = useFromMyLibrary();
  const canDelete = useMemo(() => viewMode === ViewMode.Owner && isFromMyLibrary, [isFromMyLibrary, viewMode]);

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

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
    if (isError) {
      reset();
    }
  }, [isError, reset]);

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      setOpenToast(true);
    }
    if (isError) {
      setToastSeverity('error');
    } else if (isSuccess) {
      setToastSeverity('success');
    }
    if (isError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(error));
    } else if (isSuccess) {
      setToastSeverity('success');
      setToastMessage('Delete the prompt successfully');
    }
  }, [error, isError, isSuccess]);

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
    <Toast
      open={openToast}
      severity={toastSeverity}
      message={toastMessage}
      onClose={onCloseToast}
    />
  </>
}
