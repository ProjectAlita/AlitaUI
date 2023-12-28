import {
  useDeleteCollectionMutation,
  useGetCollectionQuery,
  useGetPublicCollectionQuery,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation
} from "@/api/collections";
import {
  CARD_LIST_WIDTH,
  CollectionStatus,
  ContentType,
  MyLibraryDateSortOrderOptions,
  SortOrderOptions,
  ViewMode,
} from "@/common/constants";
import AlertDialogV2 from '@/components/AlertDialogV2';
import CardList from "@/components/CardList";
import Categories from "@/components/Categories";
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditIcon from '@/components/Icons/EditIcon';
import SendUpIcon from '@/components/Icons/SendUpIcon';

import IconButton from '@/components/IconButton';
import ExportIcon from '@/components/Icons/ExportIcon';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import UnpublishIcon from '@/components/Icons/UnpublishIcon';
import SingleSelect from "@/components/SingleSelect";
import { StatusDot } from '@/components/StatusDot';
import Tooltip from '@/components/Tooltip';
import useCardList from "@/components/useCardList";
import useCardNavigate from '@/components/useCardNavigate';
import { useProjectId, useIsFromUserPublic, useViewMode } from '@/pages/hooks';
import { Box, ButtonGroup, Skeleton, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const HeaderContainer = styled('div')(() => ({
  width: CARD_LIST_WIDTH,
  marginTop: '0.5rem',
  marginBottom: '1rem',
  paddingRight: '4rem',
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

const DetailHeader = ({ collection, isOwner, isLoading, refetch }) => {
  const navigate = useNavigate();
  const theme = useTheme();
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

  const [publishCollection, { isSuccess: isPublishSuccess }] = usePublishCollectionMutation();
  const onConfirmPublish = React.useCallback(() => {
    publishCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, publishCollection, projectId]);
  React.useEffect(() => {
    if (isPublishSuccess) {
      refetch();
    }
  }, [isPublishSuccess, navigate, refetch]);

  const [unpublishCollection, { isSuccess: isUnpublishSuccess }] = useUnpublishCollectionMutation();
  const onConfirmUnpublish = React.useCallback(() => {
    unpublishCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, projectId, unpublishCollection]);
  React.useEffect(() => {
    if (isUnpublishSuccess) {
      refetch();
    }
  }, [isUnpublishSuccess, navigate, refetch]);

  const [deleteCollection, { isSuccess: isDeleteSuccess }] = useDeleteCollectionMutation();
  const onConfirmDelete = React.useCallback(() => {
    deleteCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, deleteCollection, projectId]);
  React.useEffect(() => {
    if (isDeleteSuccess) {
      navigate(-1);
    }
  }, [isDeleteSuccess, navigate]);

  return (
    <HeaderContainer>
      <RowContainer>
        <RowOneChild>
          <Typography variant='headingSmall'>{
            isLoading ?
              <Skeleton variant='waved' height='24px' width='100px' /> :
              collection?.name
          }</Typography>
        </RowOneChild>
        <RowOneChild >
          <ButtonGroup>
            {
              isOwner && collection?.status === CollectionStatus.Published &&
              <ButtonWithDialog
                icon={<UnpublishIcon fill='white' />}
                onConfirm={onConfirmUnpublish}
                hoverText='Unpublish collection'
                confirmText='Are you sure to unpublish this collection?'
              />
            }

            {
              isOwner && collection?.status === CollectionStatus.Draft &&

              <>
                <ButtonWithDialog
                  icon={<SendUpIcon fill='white' />}
                  onConfirm={onConfirmPublish}
                  hoverText='Publish collection'
                  confirmText='Are you sure to publish this collection?'
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
                  confirmText='Are you sure to delete this collection?'
                />
              </>
            }

            <Tooltip title='Reply' placement="top">
              <IconButton style={{ display: 'none' }}>
                <ReplyIcon fill='white' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Export' placement="top">
              <IconButton style={{ display: 'none' }}>
                <ExportIcon fill='white' />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </RowOneChild>
      </RowContainer>
      <RowTwoContainer>
        <RowTwoChild>
          <Typography component='div' variant='bodySmall'>
            <span>{'Status:'}</span>
            <span style={{ padding: '0 0.5rem' }}><StatusDot status={collection?.status} size='0.625rem' /></span>
            <span style={{ textTransform: 'capitalize' }}>{collection?.status}</span>
          </Typography>
        </RowTwoChild>
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
    </HeaderContainer>
  );
};

const ResponsivePageContainer = styled('div')(({ theme }) => ({
  padding: '0.5rem 1.5rem',
  [theme.breakpoints.up('centered_content')]: {
    marginLeft: 'calc(50vw - 1325px)'
  }
}));

export default function CollectionDetail() {
  const placeHolder = React.useMemo(() => <div>Let’s add prompts to create your <br />super collection!</div>, []);
  const viewMode = useViewMode();
  const projectId = useProjectId();
  const isFromUserPublic = useIsFromUserPublic();
  const { personal_project_id: myOwnerId } = useSelector(state => state.user);
  const { collectionId } = useParams();
  const { data: privateCollection, isLoading: isPrivateLoading, isError: isPrivateError, refetch: refetchPrivate } = useGetCollectionQuery({
    projectId,
    collectionId
  }, { skip: !collectionId || !projectId || viewMode === ViewMode.Public });

  const { data: publicCollection, isLoading: isPublicLoading, isError: isPublicError, refetch: refetchPublic } = useGetPublicCollectionQuery({
    collectionId
  }, { skip: !collectionId || viewMode !== ViewMode.Public });

  const collection = React.useMemo(() => viewMode !== ViewMode.Public ? privateCollection : publicCollection, [privateCollection, publicCollection, viewMode]);
  const isLoading = React.useMemo(() => viewMode !== ViewMode.Public ? isPrivateLoading : isPublicLoading, [isPrivateLoading, isPublicLoading, viewMode]);
  const isError = React.useMemo(() => viewMode !== ViewMode.Public ? isPrivateError : isPublicError, [isPrivateError, isPublicError, viewMode]);
  const refetch = React.useMemo(() => viewMode !== ViewMode.Public ? refetchPrivate : refetchPublic, [refetchPrivate, refetchPublic, viewMode]);

  const { name, prompts = [] } = collection || {};
  const isOwner = React.useMemo(() =>
    (collection?.owner_id === myOwnerId)
    , [collection, myOwnerId]);
  const {
    renderCard,
  } = useCardList(viewMode, name);

  const tagList = React.useMemo(() => {
    const result = [];
    prompts?.forEach((prompt) => {
      prompt.tags?.forEach((tag) => {
        if (!result.includes(tag)) {
          result.push(tag);
        }
      });
    });
    return result;
  }, [prompts]);

  return (
    <ResponsivePageContainer>
      <DetailHeader
        collection={collection}
        isLoading={isLoading}
        isOwner={isOwner}
        refetch={refetch}
      />
      <CardList
        cardList={prompts}
        isLoading={isLoading}
        isError={isError}
        emptyListPlaceHolder={placeHolder}
        headerHeight={'200px'}
        rightPanelOffset={'134px'}
        rightPanelContent={
          <>
            <Typography component='div' variant='labelMedium' sx={{ mb: 2 }}>Description</Typography>
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
        cardType={!isFromUserPublic ? ContentType.MyLibraryCollectionPrompts : ContentType.UserPublicCollectionPrompts}
      />
    </ResponsivePageContainer>
  );
}