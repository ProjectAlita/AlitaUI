import {
  MyLibraryRateSortOrderOptions,
  MyLibraryDateSortOrderOptions,
  MyStatusOptions,
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
import CommandIcon from '@/components/Icons/CommandIcon';
import DatabaseIcon from '@/components/Icons/DatabaseIcon';
import FolderIcon from '@/components/Icons/FolderIcon';
import MultipleSelect from '@/components/MultipleSelect';

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

const makeNewPagePath = (tab, viewMode, statuses, sortOrder) => {
  const statusesString = viewMode === ViewMode.Owner ?
    statuses.length ?
      '&statuses=' + statuses.join(',')
      :
      '&statuses=all'
    :
    '';
  const sortingString = tab !== 'collections' ? `&sort_by=created_at&sort_order=${sortOrder}` : '';
  return `${RouteDefinitions.MyLibrary}/${tab}?${SearchParams.ViewMode}=${viewMode}${statusesString}${sortingString}`;
}

export default function MyLibrary() {
  const theme = useTheme();
  const { tab = 'all' } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortBy] = useState(SortFields.Date);
  const [searchParams] = useSearchParams();
  const viewModeFromUrl = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams]);
  const sortOrder = useMemo(() => searchParams.get(SearchParams.SortOrder) || SortOrderOptions.DESC, [searchParams]);
  const statuses = useMemo(() => {
    const statusesString = searchParams.get(SearchParams.Statuses);
    if (statusesString && statusesString !== 'all') {
      return statusesString.split(',');
    }
    return [];
  }, [searchParams])
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
      statuses={statuses}
    />
  },
  {
    label: MyLibraryTabs[1],
    icon: <CommandIcon fontSize="1rem" />,
    content: <PromptsList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      statuses={statuses}
    />
  },
  {
    label: MyLibraryTabs[2],
    icon: <DatabaseIcon />,
    content: <DataSourcesList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  },
  {
    label: MyLibraryTabs[3],
    icon: <FolderIcon selected />,
    content: <CollectionsList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  }], [sortBy, sortOrder, statuses, viewMode]);

  const onChangeSortOrder = useCallback(
    (newSortOrder) => {
      const pagePath = makeNewPagePath(tab, viewMode, statuses, newSortOrder);
      navigate(pagePath,
        {
          state: {
            routeStack: [{
              breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
              viewMode,
              pagePath
            }]
          }
        });
    },
    [navigate, statuses, tab, viewMode],
  );

  const onChangeStatuses = useCallback(
    (newStatuses) => {
      const pagePath = makeNewPagePath(tab, viewMode, newStatuses, sortOrder);
      navigate(pagePath,
        {
          state: {
            routeStack: [{
              breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
              viewMode,
              pagePath
            }]
          }
        });
    },
    [navigate, sortOrder, tab, viewMode],
  );

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = makeNewPagePath(MyLibraryTabs[newTab], viewMode, [], SortOrderOptions.DESC);
      navigate(pagePath,
        {
          state: {
            routeStack: [{
              breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
              viewMode,
              pagePath
            }]
          }
        });
    },
    [navigate, viewMode],
  );

  const onChangeViewMode = useCallback(
    (mode) => {
      const routeStack = [...(state?.routeStack || [])];
      const newPath = makeNewPagePath(tab, mode, statuses, sortOrder);
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = {
          ...routeStack[routeStack.length - 1],
          viewMode: mode,
          pagePath: newPath,
        }
      } else {
        routeStack.push({
          pagePath: newPath,
          breadCrumb: 'My library',
          viewMode: mode,
        });
      }
      navigate(newPath,
        {
          state: {
            routeStack
          }
        });
      dispatch(actions.clearFilteredPromptList());
      setViewMode(mode);
    },
    [dispatch, navigate, sortOrder, state?.routeStack, statuses, tab],
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
              <MultipleSelect
                onValueChange={onChangeStatuses}
                value={statuses}
                options={MyStatusOptions}
                customSelectedColor={`${theme.palette.text.primary} !important`}
                customSelectedFontSize={'0.875rem'}
              />
            </SelectContainer>
          }
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