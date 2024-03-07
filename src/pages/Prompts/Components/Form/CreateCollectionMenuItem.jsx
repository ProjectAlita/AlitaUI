import {
  Typography,
  Box,
} from '@mui/material';
import * as React from 'react';
import { useTheme } from '@emotion/react';
import { AddButton } from './Messages';
import PlusIcon from '@/components/Icons/PlusIcon';

const CreateCollectionMenuItem = ({ disabled, onCreateCollection }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      height: '56px',
      width: '100%',
      paddingInline: '20px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.border.lines}`
    }}
    >
      <Typography color={theme.palette.text.secondary} variant='labelMedium'>Create new collection</Typography>
      <AddButton
        disabled={disabled}
        sx={{ height: '28px', width: '28px', margin: '0 0 0 0 !important', backgroundColor: `${theme.palette.background.icon.default} !important` }}
        onClick={onCreateCollection}>
        <PlusIcon width={24} height={24}
          fill={disabled ? theme.palette.background.button.primary.disabled : theme.palette.icon.fill.secondary}
        />
      </AddButton>
    </Box>
  );
};

export default CreateCollectionMenuItem;