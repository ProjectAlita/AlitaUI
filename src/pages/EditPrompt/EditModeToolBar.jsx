import { useDeletePromptMutation } from '@/api/prompts';
import { buildErrorMessage, deduplicateVersionByAuthor } from '@/common/utils';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import BookmarkIcon from '@/components/Icons/BookmarkIcon';
import ForkIcon from '@/components/Icons/ForkIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import Toast from '@/components/Toast';
import { useFromMyLibrary, useProjectId, useFromPrompts } from '@/pages/hooks';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddToCollectionDialog from './AddToCollectionDialog';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';

const HeaderItemDivider = styled('div')(({ theme }) => {
  return {
    width: '0.0625rem',
    height: '1.75rem',
    border: `1px solid ${theme.palette.border.lines}`,
    borderTop: '0',
    borderRight: '0',
    borderBottom: '0',
    marginLeft: '0.5rem'
  };
});

export const HeaderContainer = styled(Box)(() => (`
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: row-reverse;
  padding-right: 4px;
`));

const Button = styled(IconButton)(({ theme }) => (`
  display: flex;
  height: 28px;
  width: 28px;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.tabButton.active};
  margin-left: 0.5rem;
`));

export default function EditModeToolBar() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const { currentPrompt: { name }, versions = [] } = useSelector((state) => state.prompts);
  const projectId = useProjectId();
  const { promptId, } = useParams();
  const navigate = useNavigate();
  const [deletePrompt, { isLoading, error, isError, isSuccess, reset }] = useDeletePromptMutation();
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const canDelete = useFromMyLibrary();
  const isFromPrompts = useFromPrompts();

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

  const [openDialog, setOpenDialog] = useState(false);
  const onBookMark = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);

  return <>
    <HeaderContainer >
     {
      isFromPrompts && deduplicateVersionByAuthor(versions).map((versionInfo = '') => {
        const [author, avatar] = versionInfo.split('|');
        return (
          <div key={author} style={{marginLeft: '0.5rem'}}>
            <VersionAuthorAvatar name={author} avatar={avatar} size={28}/>
          </div>
        )
      })
     }
     { isFromPrompts && <HeaderItemDivider /> }
      {canDelete &&
        <Tooltip title="Delete prompt" placement="top">
          <Button
            size="medium"
            aria-label="delete prompt"
            onClick={onDelete}
          >
            <DeleteIcon sx={{ fontSize: '1rem' }} />
            {isLoading && <StyledCircleProgress />}
          </Button>
        </Tooltip>
      }
      <Button
        size="medium"
        aria-label="fork prompt"
        style={{display: 'none'}}
      >
        <ForkIcon sx={{ fontSize: '1rem' }} />
      </Button>
      <Button
        size="medium"
        aria-label="book mark"
        onClick={onBookMark}
      >
        <BookmarkIcon sx={{ fontSize: '1rem' }} />
      </Button>
    </HeaderContainer>
    <AddToCollectionDialog open={openDialog} setOpen={setOpenDialog} />
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
