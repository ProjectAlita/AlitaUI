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
import ExportDropdownMenu from '@/pages/Prompts/Components/ExportDropdownMenu';
import { useFromMyLibrary, useFromPrompts, useProjectId, useViewMode } from '@/pages/hooks';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddToCollectionDialog from './AddToCollectionDialog';
import StarActiveIcon from '@/components/Icons/StarActiveIcon';
import StarIcon from '@/components/Icons/StarIcon';
import { ViewMode } from '@/common/constants';
import useLikePrompt from '../../../components/useLikePrompt';
import HeaderContainer from '@/components/HeaderContainer';

export const HeaderItemDivider = styled('div')(({ theme }) => {
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

export const LongIconButton = styled(IconButton)(({ theme }) => (`
  display: flex;
  height: 28px;
  width: 52px;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.default};
  margin-left: 0.5rem;
  border: 1px solid ${theme.palette.border.lines};
`));

export default function EditModeToolBar() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const viewMode = useViewMode();
  const { currentPrompt, versions = [] } = useSelector((state) => state.prompts);
  const { name, is_liked, likes } = currentPrompt;
  const projectId = useProjectId();
  const { promptId, } = useParams();
  const navigate = useNavigate();
  const [deletePrompt, { isLoading, error, isError, isSuccess, reset }] = useDeletePromptMutation();
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const isFromMyLibrary = useFromMyLibrary();
  const canDelete = useMemo(() => viewMode === ViewMode.Owner && isFromMyLibrary, [isFromMyLibrary, viewMode]);
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
  const { handleLikeClick, isLoading: isLiking } = useLikePrompt(promptId, is_liked, viewMode);

  return <>
    <HeaderContainer >
      {
        (isFromPrompts || viewMode === ViewMode.Public) && deduplicateVersionByAuthor(versions).map((versionInfo = '') => {
          const [author, avatar, id] = versionInfo.split('|');
          return (
            <Tooltip key={versionInfo} title={author} placement='top'>
              <div style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>
                <VersionAuthorAvatar onClick={navigateToAuthorPublicPage(id, author)} name={author} avatar={avatar} size={28} />
              </div>
            </Tooltip>
          )
        })
      }
      {(isFromPrompts || viewMode === ViewMode.Public) && <HeaderItemDivider />}
      {canDelete &&
        <Tooltip title='Delete prompt' placement='top'>
          <IconButton
            aria-label='delete prompt'
            onClick={onDelete}
          >
            <DeleteIcon sx={{ fontSize: '1rem' }} fill='white' />
            {isLoading && <StyledCircleProgress />}
          </IconButton>
        </Tooltip>
      }

      <IconButton
        aria-label='fork prompt'
        style={{ display: 'none' }}
      >
        <ForkIcon sx={{ fontSize: '1rem' }} fill='white' />
      </IconButton>

      <ExportDropdownMenu id={promptId} name={name}>
        <Tooltip title="Export prompt" placement="top">
          <IconButton
            aria-label='export prompt'
          >
            <ExportIcon sx={{ fontSize: '1rem' }} fill='white' />
          </IconButton>
        </Tooltip>
      </ExportDropdownMenu>

      <Tooltip title="Add to collection" placement="top">
        <IconButton
          aria-label='Add to collection'
          onClick={onBookMark}
        >
          <BookmarkIcon sx={{ fontSize: '1rem' }} fill='white' />
        </IconButton>
      </Tooltip>
      {viewMode === ViewMode.Public &&
        <LongIconButton
          aria-label='Add to collection'
          disabled={isLiking}
          onClick={handleLikeClick}
        >
          {is_liked ? (
            <StarActiveIcon size={'16px'} />
          ) : (
            <StarIcon className={'icon-size'} />
          )}
          <Typography sx={{ color: 'text.primary' }} variant='labelSmall'>
            {
              likes
            }
          </Typography>
          {isLiking && <StyledCircleProgress size={20} />}
        </LongIconButton>}
    </HeaderContainer>
    <AddToCollectionDialog
      open={openDialog}
      setOpen={setOpenDialog}
      prompt={String(currentPrompt?.id) === String(promptId) ? currentPrompt : null}
    />
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
