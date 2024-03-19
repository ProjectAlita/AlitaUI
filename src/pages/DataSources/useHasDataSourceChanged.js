import { useMemo } from 'react';
import { initialDataSourceSettings } from './constants';

const useHasDataSourceChanged = (
  datasourceData,
  formik,
  context,
  dataSourceSettings,
) => {
  const hasChangedNameDescription = useMemo(() => {
    try {
      return datasourceData && JSON.stringify(formik.values) !== JSON.stringify(datasourceData);
    } catch (e) {
      return true;
    }
  }, [datasourceData, formik.values]);

  const hasDataSourceSettingChanged = useMemo(() => {
    try {
      return JSON.stringify(datasourceData?.version_details?.datasource_settings || initialDataSourceSettings) !== JSON.stringify(dataSourceSettings);
    } catch (e) {
      return true;
    }
  }, [datasourceData?.version_details?.datasource_settings, dataSourceSettings]);

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
    hasDataSourceSettingChanged,
    [hasContextChanged, hasChangedNameDescription, hasDataSourceSettingChanged])

  return hasChangedTheDataSource;
}

export default useHasDataSourceChanged;