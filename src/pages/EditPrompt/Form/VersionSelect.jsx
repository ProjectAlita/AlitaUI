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
import { useFromMyLibrary, useProjectId, useViewModeFromUrl } from '../../hooks';
import { StatusDot } from '@/components/StatusDot';
import { SearchParams } from '@/common/constants';

const VersionSelect = memo(function VersionSelect({ currentVersionName = '', versions = [] }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { promptId, version } = useParams();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
  const isFromMyLibrary = useFromMyLibrary();
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
          `/my-library/prompts/${promptId}/${encodeURIComponent(newVersionName)}?${SearchParams.ViewMode}=${viewMode}`
          :
          `/prompts/${promptId}/${encodeURIComponent(newVersionName)}`,
        {
          state
        });
    },
    [isFromMyLibrary, navigate, promptId, state, versions, viewMode],
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
          <SelectLabel variant="body2">Version</SelectLabel>
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
