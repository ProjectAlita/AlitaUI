import {
  MyPromptStatusOptions,
  MyCollectionStatusOptions,
  SearchParams,
  SortFields,
  ViewMode,
  SortOrderOptions,
  MyLibraryTabs,
} from '@/common/constants';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { useTotalPromptsQuery, useTotalPublicPromptsQuery } from '@/api/prompts';
import { useProjectId, useAuthorIdFromUrl, useAuthorNameFromUrl } from '../hooks';
import { useTotalCollectionListQuery } from '@/api/collections';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  height: 100%;
`));

const makeNewPagePath = (tab, viewMode, statuses, authorId, authorName) => {
  const statusesString = viewMode === ViewMode.Owner ?
    statuses.length ?
      '&statuses=' + statuses.join(',')
      :
      '&statuses=all'
    :
    `&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
  return `${viewMode === ViewMode.Owner ? RouteDefinitions.MyLibrary : RouteDefinitions.UserPublic}/${tab}?${SearchParams.ViewMode}=${viewMode}${statusesString}`;
}

export default function MyLibrary() {
  const theme = useTheme();
  const { tab = MyLibraryTabs[0] } = useParams();
  const navigate = useNavigate();
  const [sortBy] = useState(SortFields.Date);
  const [searchParams] = useSearchParams();
  const projectId = useProjectId();
  const authorId = useAuthorIdFromUrl();
  const authorName = useAuthorNameFromUrl();
  const { state } = useLocation();

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

  const { data: promptsData } = useTotalPromptsQuery({
    projectId,
    params: {
      tags: '',
      sort_by: sortBy,
      sort_order: sortOrder,
      query: '',
    }
  }, { skip: !projectId || viewModeFromUrl === ViewMode.Public });

  const { data: publicPromptsData } = useTotalPublicPromptsQuery({
    projectId,
    params: {
      tags: '',
      sort_by: sortBy,
      sort_order: sortOrder,
      author_id: authorId,
    }
  }, { skip: viewModeFromUrl !== ViewMode.Public });

  const {
    data: collectionData,
  } = useTotalCollectionListQuery({
    projectId,
    params: {
      query: '',
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
    }
  }, {
    skip: !projectId
  });

  const tabs = useMemo(() => [{
    label: MyLibraryTabs[0],
    count: (viewModeFromUrl === ViewMode.Owner ?
      promptsData?.total :
      publicPromptsData?.total) + collectionData?.total,
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
    count: viewModeFromUrl === ViewMode.Owner ? promptsData?.total : publicPromptsData?.total,
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
    count: collectionData?.total,
    content: <CollectionsList
      viewMode={viewMode}
      sortBy={sortBy}
      sortOrder={sortOrder}
      statuses={statuses}
    />
  }], [
    collectionData?.total,
    promptsData?.total,
    publicPromptsData?.total,
    sortBy,
    sortOrder,
    statuses,
    viewMode,
    viewModeFromUrl]);

  const onChangeStatuses = useCallback(
    (newStatuses) => {
      const pagePath = makeNewPagePath(tab, viewMode, newStatuses, authorId);
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
    [authorId, navigate, tab, viewMode],
  );

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = makeNewPagePath(MyLibraryTabs[newTab], viewMode, [], authorId, authorName);
      const {routeStack = []} = state || {};
      const newRouteStack = viewMode === ViewMode.Owner ? [{
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        viewMode,
        pagePath
      }] : routeStack;
      if (viewMode === ViewMode.Public && newRouteStack.length) {
        newRouteStack[newRouteStack.length -1] = {
          ...newRouteStack[newRouteStack.length -1],
          pagePath,
        }
      }
      navigate(pagePath,
        {
          state: {
            routeStack: newRouteStack,
          }
        });
    },
    [authorId, authorName, navigate, state, viewMode],
  );

  useEffect(() => {
    setViewMode(viewModeFromUrl);
  }, [viewModeFromUrl]);

  return (
    <StickyTabs
      tabs={tabs}
      value={MyLibraryTabs.findIndex(item => item === tab)}
      onChangeTab={onChangeTab}
      middleTabComponent={
        <>
          {
            viewMode === ViewMode.Owner &&
            <SelectContainer>
              <MultipleSelect
                onValueChange={onChangeStatuses}
                value={statuses}
                options={tab === MyLibraryTabs[3] ? MyCollectionStatusOptions : MyPromptStatusOptions}
                customSelectedColor={`${theme.palette.text.primary} !important`}
                customSelectedFontSize={'0.875rem'}
                multiple={tab !== MyLibraryTabs[3]}
              />
            </SelectContainer>
          }
        </>
      } />
  );
}