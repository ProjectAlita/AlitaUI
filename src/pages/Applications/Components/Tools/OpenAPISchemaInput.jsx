import { openAPIExtract } from '@/common/utils';
import { StyledInput } from '@/components/StyledInputEnhancer';
import { useTheme } from '@emotion/react'
import { Box, Typography, FormControl } from '@mui/material'
import { useState, useCallback } from 'react';
import YAML from 'js-yaml';
import useToast from '@/components/useToast';

const OpenAPISchemaInput = ({ containerSX = {}, value, onValueChange }) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false)
  const { ToastComponent: Toast, toastError } = useToast();

  const onDragOver = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    [],
  )

  const onDragLeave = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    [],
  )

  const parseSchemaActions = useCallback(
    (data, showError) => {
      let fileData = ''
      try {
        try {
          fileData = JSON.parse(data);
        } catch (e) {
          fileData = YAML.load(data);
        }
        if (!fileData['paths']) {
          showError && toastError('Invalid Open API schema file!');
          return { parsedActions: [], fileData };
        }
      } catch (e) {
        showError && toastError('Invalid Open API schema file!');
        return { parsedActions: [], fileData };
      }
      const parsedActions = openAPIExtract(fileData)
      return { parsedActions, fileData }
    },
    [toastError],
  )

  const handleFile = useCallback((isForDragDrop) => (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const reader = new FileReader();
    const file = isForDragDrop ? event.dataTransfer.files[0] : event.target.files[0];

    reader.onload = async (e) => {
      const contents = e.target.result
      const { parsedActions, fileData } = parseSchemaActions(contents, true);
      const schemaString = fileData ? JSON.stringify(fileData, null, 2) : ''
      onValueChange(schemaString, parsedActions)
    };
    reader.readAsText(file);
  }, [onValueChange, parseSchemaActions]);

  const onClickChooseFile = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json,.txt,.yml,.yaml';

    fileInput.onchange = handleFile(false);
    fileInput.click();
  }, [handleFile])

  const onChangeSchema = useCallback(
    (event) => {
      const { parsedActions } = parseSchemaActions(event.target.value, false);

      onValueChange(event.target.value, parsedActions)
    },
    [onValueChange, parseSchemaActions],
  )
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', ...containerSX }}>
      <Box sx={{ height: '40px', padding: '0px 0px 0px 12px', gap: '10px', display: 'flex', alignItems: 'end' }}>
        <Typography variant='bodyMedium' color={'default'}>
          Schema
        </Typography>
      </Box>
      <FormControl
        sx={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          border: `1px solid ${theme.palette.border.lines}`,
          padding: '0px 0px',
          boxSizing: 'border-box',
          '& .MuiTextField-root': {
            padding: '0px 0px'
          },
        }}
      >
        {!value && <Typography sx={{ position: 'absolute', top: '12px', left: '12px', zIndex: 100 }} variant='bodyMedium' color={theme.palette.text.button.disabled}>
          Enter or drag&drop your OpenAPI schema here, or &nbsp;
          <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={onClickChooseFile}>
            choose file
          </Box>
        </Typography>}
        <StyledInput
          fullWidth
          sx={{
            height: '400px',
            borderRadius: '8px',
            backgroundColor: isDragOver ? theme.palette.text.contextHighLight : '',
            '& .MuiOutlinedInput-root': {
              padding: '12px 12px',
              height: '400px',
              alignItems: 'start',
              boxSizing: 'border-box'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: `0px solid ${theme.palette.border.lines};`,
            },
          }}
          multiline
          maxRows={16}
          value={value}
          onChange={onChangeSchema}
          onDrop={handleFile(true)}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      </FormControl>
      <Toast />
    </Box>
  )
}

export default OpenAPISchemaInput