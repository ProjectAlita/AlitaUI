import { useLazyGetCollectionQuery } from "@/api/collections";
import {
  CARD_LIST_WIDTH,
  ContentType,
  MyLibraryDateSortOrderOptions,
  SortOrderOptions,
  ViewMode
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
import { useProjectId } from '@/pages/EditPrompt/hooks';
import { Box, ButtonGroup, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useParams } from "react-router-dom";

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
  gap: 1rem;
`);

const RowTwoChild = styled('div')(() => ({
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


const DetailHeader = ({ collectionName }) => {
  const theme = useTheme();
  const [sortOrder, setSortOrder] = React.useState(SortOrderOptions.DESC);
  const onChangeSortOrder = React.useCallback(
    (newSortOrder) => {
      setSortOrder(newSortOrder);
    },
    [],
  );
  return (
    <HeaderContainer>
      <RowContainer>
        <RowOneChild>
          <Typography variant='subtitle2' fontWeight={'600'}>{collectionName}</Typography>
        </RowOneChild>
        <RowOneChild>
          <ButtonGroup>
            <ButtonDiv><UnpublishIcon fill='white' /></ButtonDiv>
            <ButtonDiv><ReplyIcon fill='white' /></ButtonDiv>
            <ButtonDiv><ExportIcon fill='white' /></ButtonDiv>
            <ButtonDiv><EditIcon fill='white' /></ButtonDiv>
            <ButtonDiv><DeleteIcon fill='white' /></ButtonDiv>
          </ButtonGroup>
        </RowOneChild>
      </RowContainer>
      <RowTwoContainer>
        <RowTwoChild>
          <Typography variant='caption'>
            <span>{'Status:'}</span>
            <span style={{ padding: '0 0.5rem' }}><StatusDot status={'published'} size='0.625rem' /></span>
            <span>{'Published on 10.10.2023'}</span>
          </Typography>
        </RowTwoChild>
        <RowTwoChild>
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

const PageContainer = styled('div')(() => ({
  padding: '0.5rem 1.5rem',
}));

export default function CollectionDetail() {
  const viewMode = ViewMode.Public;

  const projectId = useProjectId();
  const { collectionId } = useParams();
  const [loadData, { data: collection, isLoading, isError }] = useLazyGetCollectionQuery();
  const { name, prompts = [] } = collection || {};
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
    <PageContainer>
      <DetailHeader collectionName={name} />
      <CardList
        cardList={prompts}
        isLoading={isLoading}
        isError={isError}
        rightPanelOffset={'134px'}
        rightPanelContent={
          <>
            <div>Description</div>
            <div>{collection?.description}</div>
            <Categories tagList={tagList} />
          </>
        }
        renderCard={renderCard}
        isLoadingMore={false}
        loadMoreFunc={React.useCallback(() => {}, [])}
        cardType={ContentType.Prompts}
      />
    </PageContainer>
  );
}