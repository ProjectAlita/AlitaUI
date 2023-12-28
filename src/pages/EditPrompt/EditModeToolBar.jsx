import { useDeletePromptMutation } from '@/api/prompts';
import { buildErrorMessage, deduplicateVersionByAuthor } from '@/common/utils';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import IconButton from '@/components/IconButton';
import BookmarkIcon from '@/components/Icons/BookmarkIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import ExportIcon from '@/components/Icons/ExportIcon';
import ForkIcon from '@/components/Icons/ForkIcon';
import Toast from '@/components/Toast';
import Tooltip from '@/components/Tooltip';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';
import { useNavigateToAuthorPublicPage } from '@/components/useCardNavigate';
import DropdowmMenu from '@/pages/EditPrompt/ExportDropdownMenu';
import { useFromMyLibrary, useFromPrompts, useProjectId } from '@/pages/hooks';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddToCollectionDialog from './AddToCollectionDialog';

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

  const { navigateToAuthorPublicPage } = useNavigateToAuthorPublicPage();

  return <>
    <HeaderContainer >
     {
      isFromPrompts && deduplicateVersionByAuthor(versions).map((versionInfo = '') => {
        const [author, avatar, id] = versionInfo.split('|');
        return (
          <Tooltip key={versionInfo} title={author} placement='top'>
            <div style={{marginLeft: '0.5rem', cursor: 'pointer'}}>
            <VersionAuthorAvatar onClick={navigateToAuthorPublicPage(id, author)} name={author} avatar={avatar} size={28} />
            </div>
          </Tooltip>
        )
      })
     }
     { isFromPrompts && <HeaderItemDivider /> }
      {canDelete &&
        <Tooltip title='Delete prompt' placement='top'>
          <IconButton
            aria-label='delete prompt'
            onClick={onDelete}
          >
            <DeleteIcon sx={{ fontSize: '1rem' }} fill='white'/>
            {isLoading && <StyledCircleProgress />}
          </IconButton>
        </Tooltip>
      }

      <IconButton
        aria-label='fork prompt'
        style={{display: 'none'}}
      >
        <ForkIcon sx={{ fontSize: '1rem' }} fill='white'/>
      </IconButton>

      <DropdowmMenu projectId={projectId} promptId={promptId} promptName={name}>
        <Tooltip title="Export prompt" placement="top">
            <IconButton
              aria-label='export prompt'
            >
              <ExportIcon sx={{ fontSize: '1rem' }} fill='white'/>
            </IconButton>
        </Tooltip>
      </DropdowmMenu>

      <Tooltip title="Add to collection" placement="top">
        <IconButton
          aria-label='Add to collection'
          onClick={onBookMark}
        >
          <BookmarkIcon sx={{ fontSize: '1rem' }} fill='white'/>
        </IconButton>
      </Tooltip>
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
