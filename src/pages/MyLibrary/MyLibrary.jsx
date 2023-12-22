import {
  MyStatusOptions,
  SearchParams,
  SortFields,
  ViewMode,
  SortOrderOptions,
  MyLibraryTabs,
  PAGE_SIZE,
} from '@/common/constants';
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
import { promptApi, usePromptListQuery, TAG_TYPE_PROMPT_LIST } from '@/api/prompts';
import { useProjectId } from '../hooks';
import { TAG_TYPE_COLLECTION_LIST, apis, useCollectionListQuery } from '@/api/collections';
import { useDispatch } from 'react-redux';

const SelectContainer = styled(Box)(() => (`
  display: flex;
  margin-left: 0.5rem;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
`));

const makeNewPagePath = (tab, viewMode, statuses) => {
  const statusesString = viewMode === ViewMode.Owner ?
    statuses.length ?
      '&statuses=' + statuses.join(',')
      :
      '&statuses=all'
    :
    '';
  return `${RouteDefinitions.MyLibrary}/${tab}?${SearchParams.ViewMode}=${viewMode}${statusesString}`;
}

export default function MyLibrary() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { tab = MyLibraryTabs[0] } = useParams();
  const navigate = useNavigate();
  const [sortBy] = useState(SortFields.Date);
  const [searchParams] = useSearchParams();
  const projectId = useProjectId();

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

  const { data: promptsData, isError: isPromptsError } = usePromptListQuery({
    projectId, params: {
      limit: PAGE_SIZE,
      offset: 0,
      tags: '',
      sort_by: sortBy,
      sort_order: sortOrder,
    }
  }, { skip: !projectId });
  const {
    data: collectionData,
    isError: isCollectionError,
  } = useCollectionListQuery({
    projectId,
    page: 0
  }, {
    skip: !projectId
  });

  useEffect(() => {
    if (isCollectionError) {
      dispatch(apis.util.invalidateTags([TAG_TYPE_COLLECTION_LIST]));
    }
  }, [isCollectionError, dispatch]);

  useEffect(() => {
    if (isPromptsError) {
      dispatch(promptApi.util.invalidateTags([TAG_TYPE_PROMPT_LIST]));
    }
  }, [isCollectionError, dispatch, isPromptsError]);

  const tabs = useMemo(() => [{
    label: MyLibraryTabs[0],
    count: promptsData?.total + collectionData?.total,
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
    count: promptsData?.total,
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
    />
  }], [collectionData?.total, promptsData?.total, sortBy, sortOrder, statuses, viewMode]);

  const onChangeStatuses = useCallback(
    (newStatuses) => {
      const pagePath = makeNewPagePath(tab, viewMode, newStatuses);
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
    [navigate, tab, viewMode],
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
      rightTabComponent={(tab === MyLibraryTabs[0] || tab === MyLibraryTabs[1]) &&
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
        </>
      } />
  );
}