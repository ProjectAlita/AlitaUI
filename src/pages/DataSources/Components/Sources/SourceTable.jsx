/* eslint-disable react/jsx-no-bind */
import { Box, Typography, useTheme } from "@mui/material";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import NormalRoundButton from "@/components/NormalRoundButton.jsx";
import { StyledRemoveIcon } from "@/components/SearchBarComponents.jsx";
import useComponentMode from "@/components/useComponentMode.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import { useFormikContext } from "formik";
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
  const { isView } = useComponentMode(mode)
  const { values, setFieldValue, handleBlur, handleChange: handleFieldChange } = useFormikContext();
  const options = useOptions({ initialState, setFieldValue, values, mode });

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur
  }), [handleBlur, handleFieldChange])

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
    const fileName = values.source?.options?.file?.name
    setFileExt(fileName ? fileName.split('.').at(-1) : '')
  }, [values.source?.options?.file?.name])

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
        >
          Choose file
        </NormalRoundButton>

        <Typography
          variant='bodyMedium'
          component='div'
          color={theme.palette.text.secondary}
          sx={{ flexGrow: 1 }}
        >
          {file?.name}
        </Typography>
        <StyledRemoveIcon onClick={handleRemoveFile} />
      </Box>
      {fileExt === 'csv' && <StyledInput
        name='source.options.encoding'
        label='File encoding'
        value={encoding}
        {...inputProps}
        disabled={isView}
      />}
      <StyledInput
        name='source.options.columns'
        label='Columns'
        value={columns}
        {...inputProps}
        disabled={isView}
      />
      <StyledInput
        required={columns !== ''}
        name='source.options.column_delimiter'
        label='Column delimiter'
        value={column_delimiter}
        {...inputProps}
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