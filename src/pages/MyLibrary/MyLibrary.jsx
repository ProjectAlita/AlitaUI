import StickyTabs from '../../components/StickyTabs';
import { useMemo, useState, useCallback } from 'react';
import SingleSelect from '@/components/SingleSelect';
import { MyLibrarySortByOptions, MyStatusOptions, ViewOptions } from '@/common/constants';
import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import styled from '@emotion/styled';
import MyCardList from './MyCardList';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import isPropValid from '@emotion/is-prop-valid';
import { UserInfo } from '@/components/NavBar';

const UserInfoContainer = styled(Box)(() => (`
  display: flex;
  align-items: center;
`));

const SelectContainer = styled(Box)(() => (`
  margin-left: 1.75rem;
`));

const UserAvatar = styled(Avatar)(() => `
  padding: 0px;
`);

const InfoText = styled(Typography, {
  shouldForwardProp: prop => isPropValid(prop)
})(({ theme, color, marginLeft }) => `
  margin-left: ${marginLeft};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; 
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${color || theme.palette.text.primary}
`);

const HeaderInfo = ({ defaultMode = 'owner', onChangeMode }) => {
  const avatar = useSelector((state) => state.user?.avatar) || 'https://i.pravatar.cc/300?a=1'
  const userName = useSelector((state) => state.user?.name) || 'Bill Gates'
  const theme = useTheme();
  const [information] = useState({
    Level: 1,
    Exp: '1/100',
    Rewards: 0,
    'Total likes': 37,
    'My prompts': 10,
    'My contributions': 3
  });
  const [viewMode, setViewMode] = useState(defaultMode);

  const onChangeModeHandler = useCallback(
    (mode) => {
      setViewMode(mode);
      onChangeMode(mode);
    },
    [onChangeMode],
  );

  return (
    <>
      <UserInfoContainer>
        <UserAvatar alt={userName} src={avatar} />
        <UserInfo color={theme.palette.text.secondary} width={'10rem'} showRole />
        {
          Object.keys(information).map((key) => {
            return (
              <UserInfoContainer key={key}>
                <InfoText marginLeft='1rem'>
                  {key + ':'}
                </InfoText>
                <InfoText noWrap>
                  &nbsp;
                </InfoText>
                <InfoText color={theme.palette.text.secondary}>
                  {information[key]}
                </InfoText>
              </UserInfoContainer>
            )
          })
        }
      </UserInfoContainer>
      <SelectContainer>
        <SingleSelect
          onValueChange={onChangeModeHandler}
          value={viewMode}
          options={ViewOptions}
          customSelectedColor={`${theme.palette.text.primary} !important`}
          customSelectedFontSize={'0.875rem'}
        />
      </SelectContainer>
    </>
  )
}

export default function MyLibrary() {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState('date');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState('owner');

  const tabs = useMemo(() => [{
    label: 'All',
    content: <MyCardList type='all' mode={viewMode} />
  },
  {
    label: 'Prompts',
    content: <MyCardList type='prompts' mode={viewMode}/>
  },
  {
    label: 'Datasources',
    content: <MyCardList type='datasources' mode={viewMode}/>
  },
  {
    label: 'Collections',
    content: <MyCardList type='collections' mode={viewMode} />
  }], [viewMode]);

  const onChangeSortBy = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
    },
    [],
  );

  const onChangeStatus = useCallback(
    (newStatus) => {
      setStatus(newStatus);
    },
    [],
  );

  const onChangeViewMode = useCallback(
    (mode) => {
      setViewMode(mode);
    },
    [],
  );

  return (
    <StickyTabs
      tabs={tabs}
      extraHeader={<HeaderInfo defaultMode='owner' onChangeMode={onChangeViewMode} />}
      rightTabComponent={
        <>
          {
            viewMode === 'owner' &&
            <SelectContainer>
              <SingleSelect
                onValueChange={onChangeStatus}
                value={status}
                options={MyStatusOptions}
                customSelectedColor={`${theme.palette.text.primary} !important`}
                customSelectedFontSize={'0.875rem'}
              />
            </SelectContainer>
          }
          <SelectContainer>
            <SingleSelect
              onValueChange={onChangeSortBy}
              value={sortBy}
              options={MyLibrarySortByOptions}
              customSelectedColor={`${theme.palette.text.primary} !important`}
              customSelectedFontSize={'0.875rem'}

            />
          </SelectContainer>
        </>
      } />
  );
}