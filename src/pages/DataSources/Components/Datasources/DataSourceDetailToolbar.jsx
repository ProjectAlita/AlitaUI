import { buildErrorMessage, deduplicateVersionByAuthor } from '@/common/utils';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import IconButton from '@/components/IconButton';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import Tooltip from '@/components/Tooltip';
import { useFromMyLibrary, useNavBlocker, useProjectId, useViewMode } from '@/pages/hooks';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewMode } from '@/common/constants';
import HeaderContainer from '@/components/HeaderContainer';
import { useDeleteDatasourceMutation } from '@/api/datasources';
import useToast from '@/components/useToast';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';
import { useNavigateToAuthorPublicPage } from '@/components/useCardNavigate';
import { HeaderItemDivider, LongIconButton } from '@/pages/Prompts/Components/EditModeToolBar';
import { useLikeDataSourceCard } from '@/components/useCardLike';
import StarActiveIcon from '@/components/Icons/StarActiveIcon';
import StarIcon from '@/components/Icons/StarIcon';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import BookmarkIcon from '@/components/Icons/BookmarkIcon';
import AddToCollectionDialog from '@/pages/Prompts/Components/AddToCollectionDialog';

export default function DataSourceDetailToolbar({ name, versions, id, owner_id, is_liked, likes }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const { personal_project_id } = useSelector(state => state.user);
  const { datasourceId, } = useParams();
  const navigate = useNavigate();
  const [deleteDatasource, { isLoading, error, isError, isSuccess, reset }] = useDeleteDatasourceMutation();
  const isFromMyLibrary = useFromMyLibrary();
  const canDelete = useMemo(() => viewMode === ViewMode.Owner && isFromMyLibrary, [isFromMyLibrary, viewMode]);
  const { handleLikeDataSourceClick, isLoading: isLiking } = useLikeDataSourceCard(id, is_liked, viewMode);
  const { setBlockNav } = useNavBlocker();
  const onCloseToast = useCallback(() => {
    if (isError) {
      reset();
    } else if (isSuccess) {
      setBlockNav(false);
      navigate(-1);
    }
  }, [isError, isSuccess, navigate, reset, setBlockNav]);

  const { ToastComponent: Toast, toastInfo, toastError } = useToast({ onCloseToast });
  const [openDialog, setOpenDialog] = useState(false);
  const onBookMark = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);

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

  const { navigateToAuthorPublicPage } = useNavigateToAuthorPublicPage();

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

  const {
    fetchCollectionParams,
    disableFetchingCollectionCondition,
    patchBody,
    fieldForAlreadyAdded } = useMemo(() => {
      return {
        fetchCollectionParams: {
          datasource_id: id,
          datasource_owner_id: owner_id,
        },
        disableFetchingCollectionCondition: false,
        patchBody: {
          datasource: {
            id,
            owner_id,
          }
        },
        fieldForAlreadyAdded: 'includes_datasource'
      }
    }, [id, owner_id])

  return <>
    <HeaderContainer >
      {
        (viewMode === ViewMode.Public || projectId != personal_project_id) && deduplicateVersionByAuthor(versions).map((versionInfo = '') => {
          const [author, avatar, authorId] = versionInfo.split('|');
          return (
            <Tooltip key={versionInfo} title={author} placement='top'>
              <div style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>
                <VersionAuthorAvatar
                  onClick={navigateToAuthorPublicPage(authorId, author)}
                  name={author}
                  avatar={avatar}
                  size={28}
                />
              </div>
            </Tooltip>
          )
        })
      }
      {(viewMode === ViewMode.Public || projectId != personal_project_id) && <HeaderItemDivider />}
      {viewMode === ViewMode.Public &&
        <Tooltip title="Add to collection" placement="top">
          <IconButton
            aria-label='Add to collection'
            onClick={onBookMark}
          >
            <BookmarkIcon sx={{ fontSize: '1rem' }} fill='white' />
          </IconButton>
        </Tooltip>
      }
      {viewMode === ViewMode.Public &&
        <LongIconButton
          aria-label='Add to collection'
          disabled={isLiking}
          onClick={handleLikeDataSourceClick}
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
    <AddToCollectionDialog
      open={openDialog}
      setOpen={setOpenDialog}
      fetchCollectionParams={fetchCollectionParams}
      disableFetchingCollectionCondition={disableFetchingCollectionCondition}
      patchBody={patchBody}
      fieldForAlreadyAdded={fieldForAlreadyAdded}
    />
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
