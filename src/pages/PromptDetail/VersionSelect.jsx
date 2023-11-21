import { useLazyGetVersionDetailQuery } from '@/api/prompts';
import {
  SOURCE_PROJECT_ID
} from '@/common/constants.js';
import SingleSelect from '@/components/SingleSelect';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  SelectLabel,
  VersionContainer,
  VersionSelectContainer,
} from './Common';

export default function VersionSelect({ currentVersionName = '', versions = [] }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { promptId, version } = useParams();
  const [getVersionDetail] = useLazyGetVersionDetailQuery();
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const versionSelectOptions = useMemo(() => versions.map(({ name, id }) => ({ label: name, value: id })), [versions]);

  const onSelectVersion = useCallback(
    (newVersion) => {
      const newVersionName = versions.find(item => item.id === newVersion)?.name;
      navigate(`/prompt/${promptId}/${newVersionName}`);
    },
    [navigate, promptId, versions],
  );

  useEffect(() => {
    if (version) {
      const versionId = versions.find(item => item.name === version)?.id;
      getVersionDetail({ projectId: SOURCE_PROJECT_ID, promptId, version: versionId });
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
          />
        </VersionSelectContainer>
      </>
      : null
  );
}
