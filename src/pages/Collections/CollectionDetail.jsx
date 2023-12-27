import { useLazyGetCollectionQuery } from "@/api/collections";
import {
  CARD_LIST_WIDTH,
  CollectionStatus,
  ContentType,
  MyLibraryDateSortOrderOptions,
  SortOrderOptions,
  ViewMode,
} from "@/common/constants";
import CardList from "@/components/CardList";
import Categories from "@/components/Categories";
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditIcon from '@/components/Icons/EditIcon';
import ExportIcon from '@/components/Icons/ExportIcon';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import UnpublishIcon from '@/components/Icons/UnpublishIcon';
import SingleSelect from "@/components/SingleSelect";
import { StatusDot } from '@/components/StatusDot';
import useCardList from "@/components/useCardList";
import useCardNavigate from '@/components/useCardNavigate';
import { useCollectionProjectId, useViewMode } from '@/pages/hooks';
import { Box, ButtonGroup, Skeleton, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EmptyCollection from './EmptyCollection';

const HeaderContainer = styled('div')(() => `
  width: ${CARD_LIST_WIDTH};
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-right: 3rem;
`);

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

const DetailHeader = ({ collection, isOwner, isLoading }) => {
  const theme = useTheme();
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
              <ButtonDiv><UnpublishIcon fill='white' /></ButtonDiv>
            }
            {
              isOwner &&
              <ButtonDiv onClick={goEdit}><EditIcon fill='white' /></ButtonDiv>
            }
            <ButtonDiv style={{ display: 'none' }}><ReplyIcon fill='white' /></ButtonDiv>
            <ButtonDiv style={{ display: 'none' }}><ExportIcon fill='white' /></ButtonDiv>
            <ButtonDiv style={{ display: 'none' }}><DeleteIcon fill='white' /></ButtonDiv>
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
  const viewMode = useViewMode();
  const projectId = useCollectionProjectId();
  const { id: userId } = useSelector(state => state.user);
  const { collectionId } = useParams();
  const [loadData, { data: collection, isLoading, isError }] = useLazyGetCollectionQuery();
  const { name, prompts = [] } = collection || {};
  const isOwner = React.useMemo(() =>
    (viewMode === ViewMode.Owner) && (collection?.owner_id === userId)
    , [collection, userId, viewMode]);
  const {
    renderCard,
  } = useCardList(viewMode, name);

  React.useEffect(() => {
    if (projectId && collectionId) {
      loadData({
        projectId,
        collectionId
      })
    }
  }, [collectionId, loadData, projectId]);

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
      <DetailHeader collection={collection} isLoading={isLoading} isOwner={isOwner} />
      {
        prompts.length > 0 || isLoading ? (
          <CardList
            cardList={prompts}
            isLoading={isLoading}
            isError={isError}
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
          />) : (
          <EmptyCollection description={collection?.description} isLoading={isLoading} />
        )
      }
    </ResponsivePageContainer>
  );
}