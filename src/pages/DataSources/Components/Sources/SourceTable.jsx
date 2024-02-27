/* eslint-disable */
import {Box, Typography, useTheme} from "@mui/material";
import {StyledInput} from "@/pages/EditPrompt/Common.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import NormalRoundButton from "@/components/NormalRoundButton.jsx";
import {StyledRemoveIcon} from "@/components/SearchBarComponents.jsx";
import useComponentMode from "@/components/useComponentMode.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";


const initialState = {
  columns: '',
  column_delimiter: ',',
  file: {},
  json_documents: true,
  raw_content: false,
  encoding: 'auto'
}

const SourceTable = ({formik, mode}) => {
  const theme = useTheme()
  const {isCreate, isView} = useComponentMode(mode)

  useEffect(() => {
    formik.setFieldValue('source.options', initialState)
    return () => {
      formik.setFieldValue('source.options', null)
    }
  }, [formik.setFieldValue])

  const options = useMemo(() => {
      if (formik.values.source?.options) {
        return formik.values.source.options
      }
      return initialState
    },
    [formik.values.source?.options]);

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: formik.handleChange,
    onBlur: formik.handleBlur
  }), [formik.handleBlur, formik.handleChange])

  const {columns, column_delimiter, json_documents = initialState.json_documents, raw_content = initialState.raw_content, file, encoding} = options
  const [fileExt, setFileExt] = useState('')
  useEffect(() => {
    const fileName = formik.values.source?.options?.file?.name
    setFileExt(fileName ? fileName.split('.').at(-1) : '')
  }, [formik.values.source?.options?.file?.name])

  const fileInput = useRef(null)
  const handleRemoveFile = () => {
    fileInput.current.value = ''
    formik.setFieldValue('source.options.file', initialState.file)
  }
  const handleChangeFile = e => {
    e.target.files.length > 0 && 
      e.target.files[0] && 
      formik.setFieldValue('source.options.file', e.target.files[0])
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
          sx={{flexGrow: 1}}
        >
          {file?.name}
        </Typography>
        <StyledRemoveIcon onClick={handleRemoveFile}/>
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
        onChange={e => formik.setFieldValue('source.options.json_documents', e.target.checked)}
        disabled={isView}
      />
      <CheckLabel
        label='Raw content'
        checked={raw_content}
        onChange={e => formik.setFieldValue('source.options.raw_content', e.target.checked)}
        disabled={isView}
      />
    </>
  )
}
export default SourceTable