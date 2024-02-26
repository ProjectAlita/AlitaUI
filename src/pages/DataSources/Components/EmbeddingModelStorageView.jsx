import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material'
import { storages } from './DatasourceCreateForm';

const EmbeddingModelStorageView = ({
  embeddingModelName,
  storage,
}) => {
  const storageName = useMemo(() => storages.find(item => item.value == storage)?.label, [storage])
  return (
    <Box my={1}>
      <Typography variant='bodySmall'>Embedding model: </Typography>
      <Typography variant='headingSmall'>{embeddingModelName}</Typography>
      <Typography variant='bodySmall' ml={2}>Storage: </Typography>
      <Typography variant='headingSmall'>{storageName}</Typography>
    </Box>
  );
}

export default EmbeddingModelStorageView