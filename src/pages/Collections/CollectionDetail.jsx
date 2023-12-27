import { useDeleteCollectionMutation, useGetCollectionQuery, usePublishCollectionMutation } from "@/api/collections";
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

import ExportIcon from '@/components/Icons/ExportIcon';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import UnpublishIcon from '@/components/Icons/UnpublishIcon';
import SingleSelect from "@/components/SingleSelect";
import { StatusDot } from '@/components/StatusDot';
import useCardList from "@/components/useCardList";
import useCardNavigate from '@/components/useCardNavigate';
import { useProjectId, useViewMode } from '@/pages/hooks';
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

const ButtonDiv = styled('div')(({ theme }) => `
  cursor: pointer;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  padding: 0.375rem;
  margin-left: 0.5rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.tabButton.active};
`);

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

  const [openPublishConfirm, setOpenPublishConfirm] = React.useState(false);
  const onPublish = React.useCallback(() => {
    setOpenPublishConfirm(true);
  }, [setOpenPublishConfirm]);
  const [publishCollection, {isSuccess: isPublishSuccess}] = usePublishCollectionMutation();
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

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const onDelete = React.useCallback(() => {
    setOpenConfirm(true);
  }, [setOpenConfirm]);
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
              <ButtonDiv style={{ display: 'none' }} title='Unpublish'><UnpublishIcon fill='white' /></ButtonDiv>
            }
            {
              isOwner && collection?.status === CollectionStatus.Draft &&
              <>
                <ButtonDiv onClick={onPublish} title='Publish collection'><SendUpIcon fill='white'/></ButtonDiv>
                <AlertDialogV2
                  open={openPublishConfirm}
                  setOpen={setOpenPublishConfirm}
                  title='Warning'
                  content="Are you sure to publish this collection?"
                  onConfirm={onConfirmPublish}
                />
                <ButtonDiv onClick={goEdit} title='Edit'><EditIcon fill='white' /></ButtonDiv>
                <ButtonDiv onClick={onDelete} title='Delete'><DeleteIcon fill='white' /></ButtonDiv>
                <AlertDialogV2
                  open={openConfirm}
                  setOpen={setOpenConfirm}
                  title='Warning'
                  content="Are you sure to delete this collection?"
                  onConfirm={onConfirmDelete}
                />
              </>
            }
            <ButtonDiv style={{ display: 'none' }} title='Reply'><ReplyIcon fill='white' /></ButtonDiv>
            <ButtonDiv style={{ display: 'none' }} title='Export'><ExportIcon fill='white' /></ButtonDiv>
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
  const { id: userId } = useSelector(state => state.user);
  const { collectionId } = useParams();
  const { data: collection, isLoading, isError, refetch } = useGetCollectionQuery({
    projectId,
    collectionId
  }, { skip: !collectionId || !projectId });
  const { name, prompts = [] } = collection || {};
  const isOwner = React.useMemo(() =>
    (collection?.owner_id === userId)
    , [collection, userId]);
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
        cardType={ContentType.MyLibraryCollectionPrompts}
      />
    </ResponsivePageContainer>
  );
}