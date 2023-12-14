import {
  MyLibraryRateSortOrderOptions,
  MyLibraryDateSortOrderOptions,
  MyLibrarySortByOptions,
  MyStatusOptions,
  PromptStatus,
  SearchParams,
  SortFields,
  ViewMode,
  ViewOptions,
  SortOrderOptions,
  MyLibraryTabs,
} from '@/common/constants';
import { UserInfo } from '@/components/NavBar';
import SingleSelect from '@/components/SingleSelect';
import { actions } from '@/slices/prompts';
import isPropValid from '@emotion/is-prop-valid';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import StickyTabs from '@/components/StickyTabs';
import UserAvatar from '@/components/UserAvatar';
import AllStuffList from './AllStuffList';
import PromptsList from './PromptsList';
import CollectionsList from './CollectionsList';
import DataSourcesList from './DataSourcesList';
import RouteDefinitions, { PathSessionMap } from '@/routes';

const UserInfoContainer = styled(Box)(() => (`
  display: flex;
  align-items: center;
`));

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 1.75rem;
  z-index: 1001;
  display: flex;
  align-items: center;
`));

const ViewModeSelectContainer = styled(Box)(() => (`
  padding-top: 4px;
  margin-left: 1rem;
`));

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

const HeaderInfo = ({ viewMode = ViewMode.Public, onChangeMode }) => {
  const avatar = useSelector((state) => state.user?.avatar)
  const userName = useSelector((state) => state.user?.name);
  const theme = useTheme();
  const [information] = useState({
    Level: 1,
    Exp: '1/100',
    Rewards: 0,
    'Total likes': 37,
    'My prompts': 10,
    'My contributions': 3
  });

  const onChangeModeHandler = useCallback(
    (mode) => {
      onChangeMode(mode);
    },
    [onChangeMode],
  );

  return (
    <>
      <UserInfoContainer>
        <UserAvatar avatar={avatar} name={userName} size={36} />
        <UserInfo color={theme.palette.text.secondary} width={'auto'} />
        {
          Object.keys(information).map((key, index) => {
            return (
              <UserInfoContainer key={key}>
                <InfoText marginLeft={index === 0 ? '0' : '1rem'}>
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
      <ViewModeSelectContainer>
        <SingleSelect
          onValueChange={onChangeModeHandler}
          value={viewMode}
          options={ViewOptions}
          customSelectedColor={`${theme.palette.text.primary} !important`}
          customSelectedFontSize={'0.875rem'}
        />
      </ViewModeSelectContainer>
    </>
  )
}

export default function MyLibrary() {
  const theme = useTheme();
  const { tab = 'all' } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState(SortFields.Date);
  const [sortOrder, setSortOrder] = useState(SortOrderOptions.DESC);
  const [status, setStatus] = useState(PromptStatus.All);
  const [searchParams, setSearchParams] = useSearchParams();
  const viewModeFromUrl = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams])
  const [viewMode, setViewMode] = useState(viewModeFromUrl);
  const sortSortOrderOptions = useMemo(() => sortBy === SortFields.Date ?
    MyLibraryDateSortOrderOptions :
    MyLibraryRateSortOrderOptions, [sortBy]);

  const tabs = useMemo(() => [{
    label: MyLibraryTabs[0],
    content: <AllStuffList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      status={status}
    />
  },
  {
    label: MyLibraryTabs[1],
    content: <PromptsList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      status={status}
    />
  },
  {
    label: MyLibraryTabs[2],
    content: <DataSourcesList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      status={status}
    />
  },
  {
    label: MyLibraryTabs[3],
    content: <CollectionsList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      status={status}
    />
  }], [sortBy, sortOrder, status, viewMode]);

  const onChangeSortBy = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
    },
    [],
  );

  const onChangeSortOrder = useCallback(
    (newSortOrder) => {
      setSortOrder(newSortOrder);
    },
    [],
  );

  const onChangeStatus = useCallback(
    (newStatus) => {
      setStatus(newStatus);
    },
    [],
  );

  const onChangeTab = useCallback(
    (newTab) => {
      navigate(`${RouteDefinitions.MyLibrary}/${MyLibraryTabs[newTab]}?${SearchParams.ViewMode}=${viewMode}`,
        {
          state: state || {
            breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary]
          }
        });
    },
    [navigate, state, viewMode],
  );

  const onChangeViewMode = useCallback(
    (mode) => {
      setSearchParams({ [SearchParams.ViewMode]: mode });
      dispatch(actions.clearFilteredPromptList());
      setViewMode(mode);
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    setViewMode(viewModeFromUrl);
  }, [viewModeFromUrl]);

  return (
    <StickyTabs
      tabs={tabs}
      value={MyLibraryTabs.findIndex(item => item === tab)}
      onChangeTab={onChangeTab}
      extraHeader={<HeaderInfo viewMode={viewMode} onChangeMode={onChangeViewMode} />}
      rightTabComponent={
        <>
          {
            viewMode === ViewMode.Owner &&
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
          <SelectContainer>
            <SingleSelect
              onValueChange={onChangeSortOrder}
              value={sortOrder}
              options={sortSortOrderOptions}
              customSelectedColor={`${theme.palette.text.primary} !important`}
              customSelectedFontSize={'0.875rem'}
            />
          </SelectContainer>
        </>
      } />
  );
}