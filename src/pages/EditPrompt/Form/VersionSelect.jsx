import { useLazyGetVersionDetailQuery } from '@/api/prompts';
import SingleSelect from '@/components/SingleSelect';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  SelectLabel,
  VersionContainer,
  VersionSelectContainer,
} from '../Common';
import RouteDefinitions from '@/routes';
import {
  useNameFromUrl,
  useFromMyLibrary,
  useIsFromModeration,
  useProjectId,
  useViewModeFromUrl,
  useCollectionFromUrl,
  useIsFromUserPublic,
  useAuthorIdFromUrl,
  useAuthorNameFromUrl,
} from '../../hooks';
import { StatusDot } from '@/components/StatusDot';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';
import { SearchParams, TIME_FORMAT } from '@/common/constants';
import { timeFormatter } from '@/common/utils'

const VersionSelect = memo(function VersionSelect({ currentVersionName = '', versions = [], enableVersionListAvatar = false }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { promptId, version, tab, collectionId } = useParams();
  const promptName = useNameFromUrl();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
  const isFromMyLibrary = useFromMyLibrary();
  const isFromUserPublic = useIsFromUserPublic();
  const isFromModeration = useIsFromModeration();
  const collection = useCollectionFromUrl();
  const authorId = useAuthorIdFromUrl();
  const authorName = useAuthorNameFromUrl();
  const viewMode = useViewModeFromUrl();
  const projectId = useProjectId();
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const versionSelectOptions = useMemo(() => {
    return versions.map(({ name, id, status, created_at, author = {} }) => {
      const displayName = author.name;
      const avatar = author.avatar;
      return {
        label: name,
        value: id,
        date: timeFormatter(created_at, TIME_FORMAT.DDMMYYYY),
        icon: enableVersionListAvatar ? <VersionAuthorAvatar name={displayName} avatar={avatar} /> : <StatusDot status={status} />,
      }
    });
  }, [enableVersionListAvatar, versions]);

  const onSelectVersion = useCallback(
    (newVersion) => {
      const newVersionName = versions.find(item => item.id === newVersion)?.name;
      const promptSubPath = `${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${promptName}`;
      const newPath =
        isFromMyLibrary ?
          (
            collectionId ?
              `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${promptSubPath}&${SearchParams.Collection}=${collection}`
              :
              `${RouteDefinitions.MyLibrary}/prompts/${promptSubPath}`
          )
          :
          (
            isFromUserPublic ?
              `${RouteDefinitions.UserPublic}/prompts/${promptSubPath}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}${collection ? `&${SearchParams.Collection}=${collection}` : ''}`
              :
              isFromModeration ?
                `${RouteDefinitions.ModerationSpace}/prompts/${promptSubPath}`
                :
                `${RouteDefinitions.Prompts}/${tab}/${promptSubPath}`
          );
      const routeStack = [...(state?.routeStack || [])];
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = {
          ...routeStack[routeStack.length - 1],
          pagePath: newPath,
        }
      } else {
        routeStack.push({
          pagePath: newPath,
          breadCrumb: promptName,
          viewMode,
        });
      }

      navigate(
        newPath,
        {
          state: {
            routeStack
          }
        });
    },
    [
      authorId,
      authorName,
      versions,
      isFromMyLibrary,
      isFromModeration,
      isFromUserPublic,
      collectionId,
      promptId,
      viewMode,
      promptName,
      collection,
      tab,
      state?.routeStack,
      navigate
    ],
  );

  useEffect(() => {
    if (version) {
      const versionId = versions.find(item => item.name === version)?.id;
      if (versionId) {
        getVersionDetail({ projectId, promptId, version: versionId });
      }
    }
  }, [getVersionDetail, projectId, promptId, version, versions]);

  return (
    pathname !== RouteDefinitions.CreatePrompt ?
      <>
        <VersionContainer>
          <SelectLabel variant="bodyMedium">Version</SelectLabel>
        </VersionContainer>
        <VersionSelectContainer>
          <SingleSelect
            onValueChange={onSelectVersion}
            value={currentVersion}
            options={versionSelectOptions}
            enableVersionListAvatar={enableVersionListAvatar}
            showOptionIcon
          />
        </VersionSelectContainer>
      </>
      : null
  );
});

export default VersionSelect;
