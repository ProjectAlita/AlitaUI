import {
  MyPromptStatusOptions,
  MyCollectionStatusOptions,
  SearchParams,
  SortFields,
  ViewMode,
  SortOrderOptions,
  MyLibraryTabs,
  PromptStatus,
} from '@/common/constants';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { useProjectId, useAuthorIdFromUrl, useAuthorNameFromUrl, useViewMode } from '../hooks';
import { useTotalCollectionListQuery } from '@/api/collections';
import useTags from '@/components/useTags';
import { getQueryStatuses } from './useLoadPrompts';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  height: 100%;
`));

const getTagsSearch = (selectedTagIds, tagList) => {
  if (selectedTagIds) {
    const selectedTagNames = selectedTagIds.split(',').map((tagId) => {
      return tagList.find((tag) => tag.id == tagId)?.name || '';
    })
    return selectedTagNames.map(tagName => `&tags[]=${tagName}`).join('') || '';
  }
  return '';
}

const makeNewPagePath = (tab, viewMode, statuses, authorId, authorName, selectedTagIds = '', tagList = []) => {
  const tagsString = getTagsSearch(selectedTagIds, tagList)
  const statusesString =
    viewMode === ViewMode.Owner ?
    statuses.length ?
        '&statuses=' + statuses.join(',')
        :
        '&statuses=all'
      :
      `&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
  return `${viewMode === ViewMode.Owner ? RouteDefinitions.MyLibrary : RouteDefinitions.UserPublic}/${tab}?${SearchParams.ViewMode}=${viewMode}${statusesString}${tagsString}`;
}

export default function MyLibrary({publicView = false}) {
  const theme = useTheme();
  const { query } = useSelector(state => state.search);
  const { tab = MyLibraryTabs[0] } = useParams();
  const navigate = useNavigate();
  const [sortBy] = useState(SortFields.Date);
  const [searchParams] = useSearchParams();
  const projectId = useProjectId();
  const authorId = useAuthorIdFromUrl();
  const authorName = useAuthorNameFromUrl();
  const { state } = useLocation();
  const { tagList } = useSelector((storeState) => storeState.prompts);
  const { selectedTagIds } = useTags(tagList);

  const viewMode = useViewMode();
  const sortOrder = useMemo(() => searchParams.get(SearchParams.SortOrder) || SortOrderOptions.DESC, [searchParams]);
  const statuses = useMemo(() => {
    const statusesString = publicView ? PromptStatus.Published : searchParams.get(SearchParams.Statuses)
    if (statusesString) {
      return statusesString.split(',');
    }
    return [PromptStatus.All];
  }, [searchParams, publicView]);

  const { data: promptsData } = useTotalPromptsQuery({
    projectId,
    params: {
      tags: selectedTagIds,
      sort_by: sortBy,
      sort_order: sortOrder,
      query,
      statuses: getQueryStatuses(statuses),
    }
  }, { skip: !projectId || viewMode === ViewMode.Public });

  const { data: publicPromptsData } = useTotalPublicPromptsQuery({
    projectId,
    params: {
      tags: selectedTagIds,
      sort_by: sortBy,
      sort_order: sortOrder,
      author_id: authorId,
      query,
      statuses: getQueryStatuses(statuses),
    }
  }, { skip: viewMode !== ViewMode.Public });

  const {
    data: collectionData,
  } = useTotalCollectionListQuery({
    projectId,
    params: {
      tags: selectedTagIds,
      query,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: getQueryStatuses(statuses),
    }
  }, {
    skip: !projectId
  });

  const tabs = useMemo(() => [{
    label: MyLibraryTabs[0],
    count: (viewMode === ViewMode.Owner ?
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
    count: viewMode === ViewMode.Owner ? promptsData?.total : publicPromptsData?.total,
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
  ]);

  const onChangeStatuses = useCallback(
    (newStatuses) => {
      const pagePath = makeNewPagePath(
        tab,
        viewMode,
        newStatuses,
        authorId,
        undefined,
        selectedTagIds,
        tagList);
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
    [authorId, navigate, selectedTagIds, tab, tagList, viewMode],
  );

  const onChangeTab = useCallback(
    (newTab) => {
      const pagePath = makeNewPagePath(
        MyLibraryTabs[newTab],
        viewMode,
        statuses,
        authorId,
        authorName,
        selectedTagIds,
        tagList
      );
      const { routeStack = [] } = state || {};
      const newRouteStack = viewMode === ViewMode.Owner ? [{
        breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
        viewMode,
        pagePath
      }] : routeStack;
      if (viewMode === ViewMode.Public && newRouteStack.length) {
        newRouteStack[newRouteStack.length - 1] = {
          ...newRouteStack[newRouteStack.length - 1],
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
    [authorId, authorName, navigate, selectedTagIds, state, statuses, tagList, viewMode],
  );

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
                multiple={false}
              />
            </SelectContainer>
          }
        </>
      } />
  );
}