import { ContentType, ViewMode, MyLibrarySortByOptions } from "@/common/constants";
import DeleteIcon from '@/components/Icons/DeleteIcon';
import EditIcon from '@/components/Icons/EditIcon';
import ExportIcon from '@/components/Icons/ExportIcon';
import ReplyIcon from '@/components/Icons/ReplyIcon';
import UnpublishIcon from '@/components/Icons/UnpublishIcon';
import { Box, ButtonGroup, Typography } from "@mui/material";
import MyCardList from "../MyLibrary/MyCardList";
import SingleSelect from "@/components/SingleSelect";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { StatusDot } from '@/components/StatusDot';

const HeaderContainer = styled('div')(() => `
  margin-top: 0.5rem;
  width: calc(100% - 16.5rem);
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

const ButtonDiv = styled('div')(({theme}) => `
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


const DetailHeader = ({collectionName}) => {
  const theme = useTheme();
  const [sortBy, setSortBy] = React.useState('date');
  const onChangeSortBy = React.useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
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
          <ButtonDiv><UnpublishIcon fill='white'/></ButtonDiv>
          <ButtonDiv><ReplyIcon fill='white'/></ButtonDiv>
          <ButtonDiv><ExportIcon fill='white'/></ButtonDiv>
          <ButtonDiv><EditIcon fill='white'/></ButtonDiv>
          <ButtonDiv><DeleteIcon fill='white'/></ButtonDiv>
        </ButtonGroup>
      </RowOneChild>
    </RowContainer>
    <RowTwoContainer>
      <RowTwoChild>
        <Typography variant='caption'>
          <span>{'Status:'}</span>
          <span style={{ padding: '0 0.5rem'}}><StatusDot status={'published'} size='0.625rem'/></span>
          <span>{'Published on 10.10.2023'}</span>
        </Typography>
      </RowTwoChild>
      <RowTwoChild>
        <SelectContainer>
            <SingleSelect
              onValueChange={onChangeSortBy}
              value={sortBy}
              options={MyLibrarySortByOptions}
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

export default function CollectionDetail () {
  const mockName = 'Mock Collection name';
  const viewMode = ViewMode.Public;
  return (
  <PageContainer>
    <DetailHeader collectionName={mockName} />
    <MyCardList 
      type={ContentType.Prompts} 
      viewMode={viewMode} 
      collectionName={mockName}
    />
  </PageContainer>
  );
}