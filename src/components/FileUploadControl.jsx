import { useCallback, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import NormalRoundButton from '@/components/NormalRoundButton';
import { StyledRemoveIcon } from "./SearchBarComponents";

export default function FileUploadControl({ id = 'file-upload-input' }) {
  const theme = useTheme();
  const [fileName, setFileName] = useState('');

  const handleFileChange = useCallback((event) => {
    const { files } = event.target;
    if (files.length > 0) {
      setFileName(files[0].name);
      // TODO: invoke upload file API
    } else {
      setFileName('');
    }
  }, []);

  const removeFile = useCallback(() => {
    setFileName('');
  }, []);

  const handleClick = useCallback(() => {
    const fileInput = document.getElementById(id);
    fileInput.click();
  }, [id]);

  return (
    <Box sx={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '14px 12px',
      borderBottom: `1px solid ${theme.palette.border.lines}`,
    }}>
      <input
        style={{ display: 'none' }}
        id={id}
        type="file"
        onChange={handleFileChange}
      />

      <NormalRoundButton
        variant='contained'
        color='secondary'
        onClick={handleClick}
      >
        Choose file
      </NormalRoundButton>

      <Typography
        variant='bodyMedium'
        component='div'
        color={theme.palette.text.secondary}
        sx={{ flexGrow: 1 }}
      >
        {fileName}
      </Typography>
      <StyledRemoveIcon onClick={removeFile} />
    </Box>
  );
}