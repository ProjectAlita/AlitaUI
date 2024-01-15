import { useLazyGetVersionDetailQuery } from '@/api/prompts';
import { TIME_FORMAT } from '@/common/constants';
import { timeFormatter } from '@/common/utils';
import SingleSelect from '@/components/SingleSelect';
import { StatusDot } from '@/components/StatusDot';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';
import RouteDefinitions, { getBasename } from '@/routes';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useNameFromUrl,
  useProjectId,
  useViewModeFromUrl
} from '../../hooks';
import {
  SelectLabel,
  VersionContainer,
  VersionSelectContainer,
} from '../Common';

const VersionSelect = memo(function VersionSelect({ currentVersionName = '', versions = [], enableVersionListAvatar = false }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { promptId, version } = useParams();
  const promptName = useNameFromUrl();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
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
      const encodedVersion = encodeURIComponent(newVersionName);
      const basename = getBasename();
      const relativePathname = location.pathname.replace(basename, '');
      const newPathname = (version && version.length > 0) ?
        relativePathname.replace(`${promptId}/${encodeURIComponent(version)}`, `${promptId}/${encodedVersion}`) :
        relativePathname + '/' + encodedVersion;
      const newPath = newPathname + location.search;

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
          replace: true,
          state: {
            routeStack
          }
        }
      );
    },
    [versions, promptId, viewMode, promptName, version, state?.routeStack, navigate],
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
