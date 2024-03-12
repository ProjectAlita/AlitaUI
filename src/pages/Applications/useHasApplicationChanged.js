import { useMemo } from 'react';
import { initialChatSettings, initialDeduplicateSettings, initialSearchSettings } from './constants';

const useHasDataSourceChanged = (
  applicationData,
  hasChangedNameDescription,
  context,
  searchSettings,
  deduplicateSettings,
  chatSettings,
) => {
  const hasSearchSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(applicationData?.version_details?.application_settings?.search || initialSearchSettings) !== JSON.stringify(searchSettings);
    } catch (e) {
      return true;
    }
  }, [searchSettings, applicationData?.version_details?.application_settings?.search]);

  const hasDeduplicateSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(applicationData?.version_details?.application_settings?.deduplicate || initialDeduplicateSettings) !== JSON.stringify(deduplicateSettings);
    } catch (e) {
      return true;
    }
  }, [deduplicateSettings, applicationData?.version_details?.application_settings?.deduplicate]);


  const hasChatSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(applicationData?.version_details?.application_settings?.chat || initialChatSettings) !== JSON.stringify(chatSettings);
    } catch (e) {
      return true;
    }
  }, [chatSettings, applicationData?.version_details?.application_settings?.chat]);

  const hasContextChanged = useMemo(() => {
    try {
      return JSON.stringify(context) !== JSON.stringify(applicationData?.version_details?.context || '');
    } catch (e) {
      return true;
    }
  }, [context, applicationData?.version_details?.context])

  const hasChangedTheDataSource = useMemo(() =>
    hasContextChanged ||
    hasChangedNameDescription ||
    hasChatSettingChanged ||
    hasDeduplicateSettingChanged ||
    hasSearchSettingChanged,
    [
      hasContextChanged,
      hasChangedNameDescription,
      hasChatSettingChanged,
      hasDeduplicateSettingChanged,
      hasSearchSettingChanged])

  return hasChangedTheDataSource;
}

export default useHasDataSourceChanged;