import { PromptStatus } from '@/common/constants.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TabBarItems } from './Common';
import VersionSelect from './Form/VersionSelect';

export default function ModeratorRunTabBarItems() {
  const {  currentVersionFromDetail, versions } = useSelector((state) => state.prompts);
  const versionOptions = versions.filter(item => item.status === PromptStatus.OnModeration)
  const { version } = useParams();
  const currentVersionName = useMemo(() => version || currentVersionFromDetail, [currentVersionFromDetail, version]);

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versionOptions} />
    </TabBarItems>
  </>
}