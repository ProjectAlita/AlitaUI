import {
  MyLibraryRateSortOrderOptions,
  MyLibraryDateSortOrderOptions,
  MyStatusOptions,
  SearchParams,
  SortFields,
  ViewMode,
  SortOrderOptions,
  MyLibraryTabs,
} from '@/common/constants';
import SingleSelect from '@/components/SingleSelect';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import StickyTabs from '@/components/StickyTabs';
import AllStuffList from './AllStuffList';
import PromptsList from './PromptsList';
import CollectionsList from './CollectionsList';
import DataSourcesList from './DataSourcesList';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import CommandIcon from '@/components/Icons/CommandIcon';
import DatabaseIcon from '@/components/Icons/DatabaseIcon';
import FolderIcon from '@/components/Icons/FolderIcon';
import MultipleSelect from '@/components/MultipleSelect';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 1.75rem;
  z-index: 1001;
  display: flex;
  align-items: center;
`));

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
  const { tab = MyLibraryTabs[0] } = useParams();
  const navigate = useNavigate();
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
    />,
    display: 'none',
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

  useEffect(() => {
    setViewMode(viewModeFromUrl);
  }, [viewModeFromUrl]);

  return (
    <StickyTabs
      tabs={tabs}
      value={MyLibraryTabs.findIndex(item => item === tab)}
      onChangeTab={onChangeTab}
      rightTabComponent={(tab === MyLibraryTabs[0] || tab === MyLibraryTabs[1])&&
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