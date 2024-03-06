import { Box, Typography, useTheme } from "@mui/material";
import { useCallback, useRef } from "react";

import NormalRoundButton from '@/components/NormalRoundButton';
import { StyledRemoveIcon } from "./SearchBarComponents";

export default function FileUploadControl({
  id = 'file-upload-input' + Math.random().toString(36).substring(2, 11),
  file = {},
  onChangeFile,
  accept,
  disabled = false,
  label
}) {

  const theme = useTheme();
  const fileInput = useRef(null);

  const handleFileChange = useCallback((event) => {
    const { files } = event.target;
    if (files.length > 0) {
      onChangeFile(files[0])
    } else {
      onChangeFile(undefined)
    }
  }, [onChangeFile]);

  const removeFile = useCallback(() => {
    onChangeFile(undefined)
  }, [onChangeFile]);

  const handleClick = useCallback(() => {
    fileInput && fileInput.current.click()
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      padding: '14px 12px',
      borderBottom: `1px solid ${theme.palette.border.lines}`,
    }}>
      {label && <Typography
        variant='labelMedium'
        component='div'
        sx={{ 
          lineHeight: 1
        }}
      >
        {label}
      </Typography>
      }
      <Box sx={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <input
          ref={fileInput}
          hidden
          type="file"
          id={id}
          onChange={handleFileChange}
          accept={accept}
        />

        <NormalRoundButton
          variant='contained'
          color='secondary'
          onClick={handleClick}
          disabled={disabled}
        >
          Choose file
        </NormalRoundButton>

        <Typography
          variant='bodyMedium'
          component='div'
          color={disabled ? theme.palette.text.input.disabled : theme.palette.text.secondary}
          sx={{ flexGrow: 1 }}
        >
          {file?.name}
        </Typography>
        {!disabled && file?.name && <StyledRemoveIcon onClick={removeFile} />}
      </Box>
    </Box>
  );
}