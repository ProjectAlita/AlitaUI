import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material'
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import NameDescriptionReadOnlyView from '@/components/NameDescriptionReadOnlyView';
import { storages } from './DatasourceCreateForm';
import { StyledInput } from '@/components/StyledInputEnhancer';

const DataSourceView = ({
  showProjectSelect = false,
  style,
  canEdit,
  onEdit,
  currentDataSource,
  chatContext,
  onChangeChatContext,
}) => {
  const storageName = useMemo(() => storages.find(item => item.value == currentDataSource?.storage)?.label, [currentDataSource?.storage])

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'General',
          content: <div>
            <>
              <NameDescriptionReadOnlyView
                name={currentDataSource?.name}
                onClickEdit={onEdit}
                description={currentDataSource?.description}
                canEdit={canEdit}
                showProjectSelect={showProjectSelect}
              />
              <Box my={1}>
                <Typography variant='bodySmall'>Embedding model: </Typography>
                <Typography variant='headingSmall'>{currentDataSource?.embedding_model_settings?.model_name}</Typography>
                <Typography variant='bodySmall' ml={2}>Storage: </Typography>
                <Typography variant='headingSmall'>{storageName}</Typography>
              </Box>
            </>
            <TagEditor
              id='tags'
              label='Tags'
              tagList={[]}
              stateTags={currentDataSource?.version_details?.tags || []}
              disabled
            />
          </div>,
        },
        {
          title: 'Context',
          content: (
            <>
              <StyledInput
                variant='standard'
                fullWidth
                name='chatcontext'
                label='Context'
                value={chatContext}
                onChange={onChangeChatContext}
              />
            </>
          ),
        }
      ]} />
  );
}

export default DataSourceView