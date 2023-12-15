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
import { useNameFromUrl, useFromMyLibrary, useProjectId, useViewModeFromUrl, useCollectionFromUrl } from '../../hooks';
import { StatusDot } from '@/components/StatusDot';
import { SearchParams } from '@/common/constants';

const VersionSelect = memo(function VersionSelect({ currentVersionName = '', versions = [] }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { promptId, version, tab, collectionId } = useParams();
  const promptName = useNameFromUrl();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
  const isFromMyLibrary = useFromMyLibrary();
  const collection = useCollectionFromUrl();
  const viewMode = useViewModeFromUrl();
  const projectId = useProjectId();
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const versionSelectOptions = useMemo(() => {
    return versions.map(({ name, id, status }) => {
      return {
        label: name,
        value: id,
        icon: <StatusDot status={status} />,
      }
    });
  }, [versions]);

  const onSelectVersion = useCallback(
    (newVersion) => {
      const newVersionName = versions.find(item => item.id === newVersion)?.name;
      navigate(
        isFromMyLibrary ?
          collectionId ?
            `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${promptName}&${SearchParams.Collection}=${collection}`
            :
            `${RouteDefinitions.MyLibrary}/prompts/${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${promptName}`
          :
          tab ?
            `${RouteDefinitions.Prompts}/${tab}/${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${promptName}`
            :
            `${RouteDefinitions.Prompts}/${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${promptName}`,
        {
          state
        });
    },
    [isFromMyLibrary, navigate, promptId, promptName, state, tab, versions, viewMode, collectionId, collection],
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
            showOptionIcon
          />
        </VersionSelectContainer>
      </>
      : null
  );
});

export default VersionSelect;
