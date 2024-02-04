import {
  useGetCollectionQuery,
  useGetPublicCollectionQuery
} from "@/api/collections";
import {
  CARD_LIST_WIDTH,
  CollectionStatus,
  ContentType,
  MyLibraryDateSortOrderOptions,
  SortOrderOptions,
  ViewMode
} from "@/common/constants";
import AlertDialogV2 from '@/components/AlertDialogV2';
import CardList from "@/components/CardList";
import Categories from "@/components/Categories";
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditIcon from '@/components/Icons/EditIcon';
import SendUpIcon from '@/components/Icons/SendUpIcon';

import { filterByElements } from '@/common/utils';
import IconButton from '@/components/IconButton';
import ExportIcon from '@/components/Icons/ExportIcon';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import UnpublishIcon from '@/components/Icons/UnpublishIcon';
import SingleSelect from "@/components/SingleSelect";
import { StatusDot } from '@/components/StatusDot';
import Toast from "@/components/Toast";
import Tooltip from '@/components/Tooltip';
import ViewToggle from "@/components/ViewToggle";
import useCardList from "@/components/useCardList";
import useCardNavigate from '@/components/useCardNavigate';
import useTags from '@/components/useTags';
import ExportDropdownMenu from '@/pages/EditPrompt/ExportDropdownMenu';
import { useIsFromCollections, useIsFromUserPublic, useProjectId, useSelectedProjectId, useViewMode } from '@/pages/hooks';
import { Box, ButtonGroup, CircularProgress, Skeleton, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ModeratorToolBar from './ModeratorToolBar';
import useCollectionActions from "./useCollectionActions";

const DetailHeaderContainer = styled('div')(() => ({
  width: CARD_LIST_WIDTH,
  marginTop: '0.5rem',
  marginBottom: '1rem',
  paddingRight: '1rem',
}));

const RowContainer = styled('div')(() => `
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`);

const RowOneChild = styled('div')(() => ({
  height: '1.5rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem'
  }
}));

const RowTwoContainer = styled('div')(() => `
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`);

const RowTwoChild = styled('div')(() => ({
  padding: '0.5rem 0',
  height: '2rem',
  '& .MuiSvgIcon-root': {
    fontSize: '0.625rem'
  }
}));

const SelectContainer = styled(Box)(() => (`
  margin-left: 1.75rem;
  z-index: 1001;
`));

const ButtonWithDialog = ({ icon, onConfirm, hoverText, confirmText }) => {
  const [open, setOpen] = React.useState(false);
  const openDialog = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  return <>
    <Tooltip title={hoverText} placement="top">
      <IconButton aria-label={hoverText} onClick={openDialog}>
        {icon}
      </IconButton>
    </Tooltip>
    <AlertDialogV2
      open={open}
      setOpen={setOpen}
      title='Warning'
      content={confirmText}
      onConfirm={onConfirm}
    />
  </>
};

const DetailHeader = ({ collection, isOwner, isLoading, refetch, isFetching }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const [sortOrder, setSortOrder] = React.useState(SortOrderOptions.DESC);
  const onChangeSortOrder = React.useCallback(
    (newSortOrder) => {
      setSortOrder(newSortOrder);
    },
    [],
  );

  const navigateToCollectionEdit = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: collection?.id,
    type: ContentType.MyLibraryCollectionsEdit,
    name: collection?.name,
    replace: true
  });
  const goEdit = React.useCallback(() => {
    navigateToCollectionEdit();
  }, [navigateToCollectionEdit]);


  const publishHoverText = 'Publish collection';

  const {
    isPending,
    isPublishSuccess,
    isUnpublishSuccess,
    isDeleteSuccess,
    onConfirmPublish,
    onConfirmUnpublish,
    onConfirmDelete,
    confirmPublishText,
    confirmUnpublishText,
    confirmDeleteText,
    openToast,
    severity,
    message,
  } = useCollectionActions({ collection });

  React.useEffect(() => {
    if (isPublishSuccess || isUnpublishSuccess) {
      refetch();
    }
  }, [isPublishSuccess, isUnpublishSuccess, navigate, refetch]);

  React.useEffect(() => {
    if (isDeleteSuccess) {
      navigate(-1);
    }
  }, [isDeleteSuccess, navigate]);

  return (
    <DetailHeaderContainer>
      <RowContainer>
        <RowOneChild>
          <Typography variant='headingSmall'>{
            isLoading ?
              <Skeleton variant='waved' height='24px' width='100px' /> :
              collection?.name
          }</Typography>
        </RowOneChild>
        <RowOneChild >
          {
            (isPending || isFetching) ?
              <CircularProgress size={20} />
              :
              <ButtonGroup >
                {
                  isOwner && collection?.status === CollectionStatus.Published &&
                  <ButtonWithDialog
                    icon={<UnpublishIcon fill='white' />}
                    onConfirm={onConfirmUnpublish}
                    hoverText='Unpublish collection'
                    confirmText={confirmUnpublishText}
                  />
                }

                {
                  isOwner && collection?.status === CollectionStatus.Draft &&

                  <>
                    <ButtonWithDialog
                      icon={<SendUpIcon fill='white' />}
                      onConfirm={onConfirmPublish}
                      hoverText={publishHoverText}
                      confirmText={confirmPublishText}
                    />

                    <Tooltip title='Edit' placement="top">
                      <IconButton onClick={goEdit}>
                        <EditIcon fill='white' />
                      </IconButton>
                    </Tooltip>

                    <ButtonWithDialog
                      icon={<DeleteIcon fill='white' />}
                      onConfirm={onConfirmDelete}
                      hoverText='Delete'
                      confirmText={confirmDeleteText}
                    />
                  </>
                }
                <Toast
                  open={openToast}
                  severity={severity}
                  message={message}
                />

                <Tooltip title='Reply' placement="top">
                  <IconButton style={{ display: 'none' }}>
                    <ReplyIcon fill='white' />
                  </IconButton>
                </Tooltip>

                <ExportDropdownMenu id={collection?.id} name={collection?.name} isCollection={true}>
                  <Tooltip title="Export Collection" placement="top">
                    <IconButton
                      aria-label='export collection'
                    >
                      <ExportIcon sx={{ fontSize: '1rem' }} fill='white' />
                    </IconButton>
                  </Tooltip>
                </ExportDropdownMenu>
                {
                  viewMode !== ViewMode.Moderator &&
                  <ExportDropdownMenu projectId={projectId} collectionId={collection?.id} collectionName={collection?.name}>
                    <Tooltip title="Export prompt" placement="top">
                      <IconButton
                        aria-label='export prompt'
                      >
                        <ExportIcon sx={{ fontSize: '1rem' }} fill='white' />
                      </IconButton>
                    </Tooltip>
                  </ExportDropdownMenu>
                }
              </ButtonGroup>
          }
        </RowOneChild>
      </RowContainer>
      <RowTwoContainer>
        <RowTwoChild>
          <Typography component='div' variant='bodySmall'>
            <span>{'Status:'}</span>
            <span style={{ padding: '0 0.5rem' }}><StatusDot status={collection?.status} /></span>
            <span style={{ textTransform: 'capitalize' }}>{collection?.status}</span>
          </Typography>
        </RowTwoChild>
        <ViewToggle />
        <RowTwoChild style={{ display: 'none' }}>
          <SelectContainer>
            <SingleSelect
              onValueChange={onChangeSortOrder}
              value={sortOrder}
              options={MyLibraryDateSortOrderOptions}
              customSelectedColor={`${theme.palette.text.primary} !important`}
              customSelectedFontSize={'0.875rem'}
            />
          </SelectContainer>
        </RowTwoChild>
      </RowTwoContainer>
    </DetailHeaderContainer>
  );
};

const ResponsivePageContainer = styled('div')(({ theme }) => ({
  padding: '0.5rem 1.5rem',
  [theme.breakpoints.up('centered_content')]: {
    marginLeft: 'calc(50vw - 1325px)'
  }
}));

const getCardType = (isFromCollections, isFromUserPublic) => isFromCollections
  ?
  ContentType.CollectionPrompts
  :
  isFromUserPublic
    ?
    ContentType.UserPublicCollectionPrompts
    :
    ContentType.MyLibraryCollectionPrompts;

export default function CollectionDetail() {
  const placeHolder = React.useMemo(() => <div>Let’s add prompts to create your <br />super collection!</div>, []);
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const isFromUserPublic = useIsFromUserPublic();
  const isFromCollections = useIsFromCollections();
  const { selectedTags } = useTags();
  const selectedProjectId = useSelectedProjectId();
  const { collectionId } = useParams();
  const {
    data: privateCollection,
    isLoading: isPrivateLoading,
    isError: isPrivateError,
    isFetching: isPrivateFetching,
    refetch: refetchPrivate
  } = useGetCollectionQuery({
    projectId,
    collectionId
  }, { skip: !collectionId || !projectId || viewMode === ViewMode.Public });

  const {
    data: publicCollection,
    isLoading: isPublicLoading,
    isError: isPublicError,
    isFetching: isPublicFetching,
    refetch: refetchPublic
  } = useGetPublicCollectionQuery({
    collectionId
  }, { skip: !collectionId || viewMode !== ViewMode.Public });

  const collection = React.useMemo(() => viewMode !== ViewMode.Public ? privateCollection : publicCollection, [privateCollection, publicCollection, viewMode]);
  const isLoading = React.useMemo(() => viewMode !== ViewMode.Public ? isPrivateLoading : isPublicLoading, [isPrivateLoading, isPublicLoading, viewMode]);
  const isError = React.useMemo(() => viewMode !== ViewMode.Public ? isPrivateError : isPublicError, [isPrivateError, isPublicError, viewMode]);
  const refetch = React.useMemo(() => viewMode !== ViewMode.Public ? refetchPrivate : refetchPublic, [refetchPrivate, refetchPublic, viewMode]);
  const isFetching = React.useMemo(() => isPrivateFetching || isPublicFetching, [isPrivateFetching, isPublicFetching]);

  const { name, prompts = { rows: [] } } = collection || {};
  const isOwner = React.useMemo(() =>
    (collection?.owner_id === selectedProjectId)
    , [collection, selectedProjectId]);
  const {
    renderCard,
  } = useCardList(viewMode, name);

  const tagList = React.useMemo(() => {
    const result = [];
    const idsSet = new Set();
    prompts?.rows?.forEach((prompt) => {
      prompt.tags?.forEach((tag) => {
        if (!idsSet.has(tag.id)) {
          idsSet.add(tag.id);
          result.push(tag);
        }
      });
    });
    return result;
  }, [prompts]);

  const visiblePrompts = filterByElements(prompts?.rows, selectedTags);
  return (
    <ResponsivePageContainer>
      <DetailHeader
        collection={collection}
        isLoading={isLoading}
        isOwner={isOwner}
        refetch={refetch}
        isFetching={isFetching}
      />
      <CardList
        cardList={visiblePrompts}
        total={visiblePrompts?.length}
        isLoading={isLoading}
        isError={isError}
        emptyListPlaceHolder={placeHolder}
        headerHeight={'200px'}
        rightPanelOffset={viewMode === ViewMode.Moderator ? '82px' : '134px'}
        rightPanelContent={
          <>
            {
              viewMode === ViewMode.Moderator && <ModeratorToolBar collectionId={collectionId} />
            }
            <Typography component='div' variant='labelMedium' sx={{ mb: 2, mt: viewMode === ViewMode.Moderator ? '26px' : '0px' }}>Description</Typography>
            {
              isLoading ?
                <Skeleton variant='waved' height='1rem' width='100%' /> :
                <Typography component='div' variant='bodySmall' sx={{ mb: 3 }}>{collection?.description}</Typography>
            }
            <Categories tagList={tagList} />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        // eslint-disable-next-line react/jsx-no-bind
        loadMoreFunc={() => { }}
        cardType={getCardType(isFromCollections, isFromUserPublic)}
      />
    </ResponsivePageContainer>
  );
}