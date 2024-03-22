import { PromptStatus } from '@/common/constants.js';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TabBarItems } from './Common';
import DiscardButton from './DiscardButton';
import VersionSelect from './Form/VersionSelect';

export default function ModeratorRunTabBarItems() {
  const navigate = useNavigate();
  const { pathname: originalPathName, search, state: locationState} = useLocation();
  const pathname = useMemo(() => decodeURI(originalPathName), [originalPathName]);
  const { version, promptId } = useParams();
  const { versions, currentPrompt } = useSelector((state) => state.prompts);
  const isVersionsLoaded = useMemo(() => String(promptId) === String(currentPrompt.id), [currentPrompt.id, promptId]);
  const versionOptions = useMemo(() => versions.filter(item => item.status === PromptStatus.OnModeration), [versions]);
  const firstVisibleVersionName = useMemo(() => versionOptions[0]?.name, [versionOptions]);
  const currentVersionName = useMemo(() => decodeURIComponent(version || '') || firstVisibleVersionName, [firstVisibleVersionName, version]);

  useEffect(() => {
    if (isVersionsLoaded && firstVisibleVersionName &&
      (!version || versionOptions.every(v => v.name !== version))) {
      const newPathname = version ?
        pathname.replace(encodeURIComponent(version), encodeURIComponent(firstVisibleVersionName)) :
        pathname + '/' + encodeURIComponent(firstVisibleVersionName);
      navigate(
        {
          pathname: encodeURI(newPathname),
          search: search,
        },
        { replace: true, state: locationState }
      );
    }
  }, [firstVisibleVersionName, isVersionsLoaded, pathname, search, locationState, navigate, version, versionOptions]);

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versionOptions} />
      <DiscardButton/> 
    </TabBarItems>
  </>
}