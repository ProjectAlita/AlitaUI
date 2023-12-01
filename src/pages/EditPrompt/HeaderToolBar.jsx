import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React, { useState, useCallback, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import BookmarkIcon from '@/components/Icons/BookmarkIcon';
import { useSelector } from 'react-redux';
import AlertDialog from '@/components/AlertDialog';
import { useFromMyLibrary, useProjectId } from '@/pages/EditPrompt/hooks';
import { useDeletePromptMutation } from '@/api/prompts';
import { useParams, useNavigate } from 'react-router-dom';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';


const HeaderContainer = styled(Box)(() => (`
  display: flex;
  height: 1.75rem;
  margin-bottom: 0.75rem;
  flex-direction: row-reverse;
`));

const Button = styled(IconButton)(({ theme }) => (`
  display: flex;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.tabButton.active};
  margin-left: 0.5rem;
`));

export default function HeaderToolBar() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const { currentPrompt: { name } } = useSelector((state) => state.prompts);
  const projectId = useProjectId();
  const { promptId, } = useParams();
  const navigate = useNavigate();
  const [deletePrompt, { isLoading, error, isError, isSuccess, reset }] = useDeletePromptMutation();
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const canDelete = useFromMyLibrary();

  const onDelete = useCallback(() => {
    setOpenAlert(true);
    setAlertTitle('Delete prompt');
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
      await deletePrompt({ projectId, promptId });
    },
    [deletePrompt, onCloseAlert, projectId, promptId],
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

  const onBookMark = useCallback(() => {
    
  }, []);

  return <>
    <HeaderContainer >
      {canDelete &&
        <Button
          size="medium"
          aria-label="delete prompt"
          onClick={onDelete}
        >
          <DeleteIcon sx={{ fontSize: '1rem' }} />
          {isLoading && <StyledCircleProgress />}
        </Button>
      }
      <Button
        size="medium"
        aria-label="book mark"
        onClick={onBookMark}
      >
        <BookmarkIcon sx={{ fontSize: '1rem' }} />
      </Button>
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
