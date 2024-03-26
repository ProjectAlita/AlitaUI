import SingleSelectWithSearch from "@/components/SingleSelectWithSearch";
import { useDatasourcesOptions } from "@/pages/MyLibrary/useDatasourcesOptions";
import { useMemo, useState } from "react";


export default function DatasourceSelect({
  onValueChange = () => { },
  value = {},
  required,
  error,
  helperText
}) {
  const [query, setQuery] = useState('');
  const { data = {}, isFetching, onLoadMore } = useDatasourcesOptions(query);
  const dataSourceOptions = useMemo(() =>
    (data.rows || []).map(({ name, id, description }) =>
      ({ label: name, value: id, description })), [data]);

  return (
    <SingleSelectWithSearch
      required={required}
      label='Datasource'
      value={value}
      onValueChange={onValueChange}
      searchString={query}
      onSearch={setQuery}
      options={dataSourceOptions}
      isFetching={isFetching}
      onLoadMore={onLoadMore}
      error={error}
      helperText={helperText}
    />
  )
}