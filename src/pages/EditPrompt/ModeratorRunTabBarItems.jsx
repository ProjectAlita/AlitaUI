import { PromptStatus } from '@/common/constants.js';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TabBarItems } from './Common';
import VersionSelect from './Form/VersionSelect';

export default function ModeratorRunTabBarItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const { versions } = useSelector((state) => state.prompts);
  const visibleStatus = useMemo(() => [PromptStatus.OnModeration, PromptStatus.Published, PromptStatus.Rejected], []);
  const versionOptions = useMemo(() => versions.filter(item => visibleStatus.includes(item.status)), [versions, visibleStatus]);
  const { version } = useParams();
  const firstVisibleVersionName = useMemo(() => versionOptions[0]?.name, [versionOptions]);
  const currentVersionName = useMemo(() => version || firstVisibleVersionName, [firstVisibleVersionName, version]);

  useEffect(() => {
    if (!version && firstVisibleVersionName) {
      navigate(
        {
          pathname: location.pathname + '/' + firstVisibleVersionName,
          search: location.search,
        },
        { replace: true, state: location.state }
      );
    }
  }, [firstVisibleVersionName, location.pathname, location.search, location.state, navigate, version]);

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versionOptions} />
    </TabBarItems>
  </>
}