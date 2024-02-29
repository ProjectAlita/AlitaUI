import { Box } from '@mui/material';
import { useState, useCallback } from 'react';
import { StyledInput } from '@/pages/Prompts/Components/Common';
import { ActionButton } from '@/components/ChatBox/StyledComponents';
import ImportIcon from '@/components/Icons/ImportIcon';

const GenerateFile = ({
  onGenerateFile,
}) => {
  const [fileName, setFileName] = useState('');
  const onChangeFileName = useCallback(
    (event) => {
      setFileName(event.target.value);
    },
    [],
  )

  return (
    <Box sx={{ marginTop: '24px', gap: '16px', display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
      <Box
        sx={{
          flex: 1,
          padding: '8px 0px',
          alignItems: 'center',
          gap: '16px'
        }}>
        <StyledInput
          variant='standard'
          fullWidth
          id='expiration'
          name='expiration'
          label=''
          type="text"
          placeholder='Input your file name'
          value={fileName}
          onChange={onChangeFileName}
          inputProps={{
            style: { textAlign: 'left' },
          }}
        />
      </Box>
      <Box >
        <ActionButton disabled={!fileName} onClick={onGenerateFile}>
          <ImportIcon sx={{ fontSize: 16 }} />
        </ActionButton>
      </Box>

    </Box >);
};

export default GenerateFile;