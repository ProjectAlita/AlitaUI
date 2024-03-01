/* eslint-disable react/jsx-no-bind */
import CheckLabel from "@/components/CheckLabel.jsx";
import NormalRoundButton from "@/components/NormalRoundButton.jsx";
import { StyledRemoveIcon } from "@/components/SearchBarComponents.jsx";
import useComponentMode from "@/components/useComponentMode.jsx";
import { Box, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
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
  const theme = useTheme()
  const { isCreate, isView } = useComponentMode(mode)
  const { setFieldValue } = useFormikContext();
  const options = useOptions({ initialState,  mode });

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

  const fileInput = useRef(null)
  const handleRemoveFile = () => {
    fileInput.current.value = ''
    setFieldValue('source.options.file', initialState.file)
  }
  const handleChangeFile = e => {
    e.target.files.length > 0 &&
      e.target.files[0] &&
      setFieldValue('source.options.file', e.target.files[0])
  }


  return (
    <>
      <Box width={'100%'} display={'flex'}
        sx={{
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '14px 12px',
          borderBottom: `1px solid ${theme.palette.border.lines}`,
        }}
      >
        <input type={'file'} hidden ref={fileInput} onChange={handleChangeFile}
          accept=".csv,.xlsx,application/vnd.ms-excel"
        />
        <NormalRoundButton
          variant='contained'
          color='secondary'
          onClick={() => {
            fileInput.current.click()
          }}
          disabled={!isCreate}
        >
          Choose file
        </NormalRoundButton>

        <Typography
          variant='bodyMedium'
          component='div'
          color={isCreate ? theme.palette.text.secondary: theme.palette.text.input.disabled}
          sx={{ flexGrow: 1 }}
        >
          {file?.name}
        </Typography>
        { isCreate && <StyledRemoveIcon onClick={handleRemoveFile} /> }
      </Box>
      {fileExt === 'csv' && <FormikInput
        name='source.options.encoding'
        label='File encoding'
        value={encoding}
        disabled={isView}
      />}
      <FormikInput
        name='source.options.columns'
        label='Columns'
        value={columns}
        disabled={isView}
      />
      <FormikInput
        required={columns !== ''}
        name='source.options.column_delimiter'
        label='Column delimiter'
        value={column_delimiter}
        disabled={isView}
      />
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