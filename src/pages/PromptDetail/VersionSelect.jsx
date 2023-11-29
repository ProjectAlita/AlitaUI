import { useLazyGetVersionDetailQuery } from '@/api/prompts';
import {
  SOURCE_PROJECT_ID
} from '@/common/constants.js';
import SingleSelect from '@/components/SingleSelect';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from '@emotion/react';
import {
  SelectLabel,
  VersionContainer,
  VersionSelectContainer,
} from './Common';
import CircleIcon from '@/components/Icons/CircleIcon';

const getVersionStatusIcon = (status, theme) => {
  let color = '';
  switch (status) {
    case 'draft':
      color = theme.palette.status.draft;
      break;
    case 'on moderation':
      color = theme.palette.status.onModeration;
      break;
    case 'published':
      color = theme.palette.status.published;
      break;
    case 'rejected':
      color = theme.palette.status.rejected;
      break;
    case 'user approval':
      color = theme.palette.status.userApproval;
      break;
    default:
      break;
  }
  return <CircleIcon fill={color} />;
}

export default function VersionSelect({ currentVersionName = '', versions = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { promptId, version } = useParams();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const versionSelectOptions = useMemo(() => {
    return versions.map(({ name, id, status }) => {
      return {
        label: name, 
        value: id, 
        icon: getVersionStatusIcon(status, theme),
      }
    });
  }, [theme, versions]);

  const onSelectVersion = useCallback(
    (newVersion) => {
      const newVersionName = versions.find(item => item.id === newVersion)?.name;
      navigate(`/prompt/${promptId}/${encodeURIComponent(newVersionName)}`, {
        state
      });
    },
    [navigate, promptId, state, versions],
  );

  useEffect(() => {
    if (version) {
      const versionId = versions.find(item => item.name === version)?.id;
      if (versionId) {
        getVersionDetail({ projectId: SOURCE_PROJECT_ID, promptId, version: versionId });
      }
    }
  }, [getVersionDetail, promptId, version, versions]);


  return (
    pathname !== '/prompt/create' ?
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
}
