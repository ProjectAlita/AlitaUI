import { useMemo } from 'react';

const useHasDataSourceChanged = (
  datasourceData,
  formik,
  context,
  searchSettings,
  deduplicateSettings,
  chatSettings,
) => {
  const hasChangedNameDescription = useMemo(() => {
    try {
      return datasourceData && JSON.stringify(formik.values) !== JSON.stringify(datasourceData);
    } catch (e) {
      return true;
    }
  }, [datasourceData, formik.values]);

  const hasSearchSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(datasourceData?.version_details?.datasource_settings?.search) !== JSON.stringify(searchSettings);
    } catch (e) {
      return true;
    }
  }, [searchSettings, datasourceData?.version_details?.datasource_settings?.search]);

  const hasDeduplicateSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(datasourceData?.version_details?.datasource_settings?.deduplicate) !== JSON.stringify(deduplicateSettings);
    } catch (e) {
      return true;
    }
  }, [deduplicateSettings, datasourceData?.version_details?.datasource_settings?.deduplicate]);


  const hasChatSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(datasourceData?.version_details?.datasource_settings?.chat) !== JSON.stringify(chatSettings);
    } catch (e) {
      return true;
    }
  }, [chatSettings, datasourceData?.version_details?.datasource_settings?.chat]);

  const hasContextChanged = useMemo(() => {
    try {
      return JSON.stringify(context) !== JSON.stringify(datasourceData?.version_details?.context || '');
    } catch (e) {
      return true;
    }
  }, [context, datasourceData?.version_details?.context])

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