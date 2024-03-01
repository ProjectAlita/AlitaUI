/* eslint-disable react/jsx-no-bind */
import CheckLabel from "@/components/CheckLabel.jsx";
import FileUploadControl from "@/components/FileUploadControl";
import useComponentMode from "@/components/useComponentMode.jsx";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import FormikInput from "./FormikInput";
import useOptions from "./useOptions";


const initialState = {
  columns: '',
  column_delimiter: ',',
  file: {},
  json_documents: true,
  raw_content: false,
  encoding: 'auto'
}

const SourceTable = ({ mode }) => {
  const { isCreate, isView } = useComponentMode(mode)
  const { setFieldValue } = useFormikContext();
  const options = useOptions({ initialState, mode });

  const {
    columns = '',
    column_delimiter = ',',
    file = {},
    json_documents = initialState.json_documents,
    raw_content = initialState.raw_content,
    encoding = 'auto'
  } = options
  const [fileExt, setFileExt] = useState('')
  useEffect(() => {
    const fileName = file?.name
    setFileExt(fileName ? fileName.split('.').at(-1) : '')
  }, [file?.name])


  return (
    <>
      <FileUploadControl
        file={file}
        disabled={!isCreate}
        onChangeFile={(value) => setFieldValue('source.options.file', value)}
        accept={'.csv,.xlsx,application/vnd.ms-excel'}
      />
      {fileExt === 'csv' && <FormikInput
        name='source.options.encoding'
        label='File encoding'
        value={encoding}
        disabled={isView}
      />}
      <FormikInput
        required
        name='source.options.columns'
        label='Columns'
        value={columns}
        disabled={isView}
      />
      {fileExt === 'csv' && <FormikInput
        required={columns !== ''}
        name='source.options.column_delimiter'
        label='Column delimiter'
        value={column_delimiter}
        disabled={isView}
      />}
      
      <CheckLabel
        label='JSON documents'
        checked={json_documents}
        onChange={e => setFieldValue('source.options.json_documents', e.target.checked)}
        disabled={isView}
      />
      <CheckLabel
        label='Raw content'
        checked={raw_content}
        onChange={e => setFieldValue('source.options.raw_content', e.target.checked)}
        disabled={isView}
      />
    </>
  )
}
export default SourceTable