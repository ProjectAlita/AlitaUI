import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material'
import { storages } from './DatasourceCreateForm';
import { useTheme } from '@emotion/react';

const EmbeddingModelStorageView = ({
  embeddingModelName,
  storage,
}) => {
  const theme = useTheme();
  const storageName = useMemo(() => storages.find(item => item.value == storage)?.label, [storage])
  return (
    <Box my={1}>
      <Typography variant='bodySmall'>Embedding model: </Typography>
      <Typography color={theme.palette.text.secondary} variant='bodySmall'>{embeddingModelName}</Typography>
      <Typography variant='bodySmall' ml={2}>Storage: </Typography>
      <Typography color={theme.palette.text.secondary} variant='bodySmall'>{storageName}</Typography>
    </Box>
  );
}

export default EmbeddingModelStorageView