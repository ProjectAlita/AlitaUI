import { useLazyGetVersionDetailQuery } from '@/api/prompts';
import { TIME_FORMAT } from '@/common/constants';
import { timeFormatter } from '@/common/utils';
import SingleSelect from '@/components/SingleSelect';
import { StatusDot } from '@/components/StatusDot';
import { VersionAuthorAvatar } from '@/components/VersionAuthorAvatar';
import RouteDefinitions from '@/routes';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useNameFromUrl,
  useProjectId,
  useViewModeFromUrl
} from '../../../hooks';
import {
  SelectLabel,
  VersionContainer,
  VersionSelectContainer,
} from '../Common';
import { replaceVersionInPath } from '../useDeleteVersion';

const VersionSelect = memo(function VersionSelect({ currentVersionName = '', versions = [], enableVersionListAvatar = false }) {
  const navigate = useNavigate();
  const { pathname, state, search } = useLocation();
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
      const newPath = replaceVersionInPath(versions.find(item => item.id === newVersion)?.name, pathname, version, promptId);
      const routeStack = [...(state?.routeStack || [])];
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = {
          ...routeStack[routeStack.length - 1],
          pagePath: `${encodeURI(newPath)}?${search}`,
        }
      } else {
        routeStack.push({
          pagePath: `${encodeURI(newPath)}?${search}`,
          breadCrumb: promptName,
          viewMode,
        });
      }

      navigate(
        { pathname: encodeURI(newPath), search },
        {
          replace: true,
          state: {
            routeStack
          }
        }
      );
    },
    [versions, pathname, version, promptId, search, state?.routeStack, navigate, promptName, viewMode],
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
