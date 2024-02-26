import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import NameDescriptionReadOnlyView from '@/components/NameDescriptionReadOnlyView';
import { StyledInput } from '@/components/StyledInputEnhancer';
import EmbeddingModelStorageView from './EmbeddingModelStorageView';

const DataSourceView = ({
  showProjectSelect = false,
  style,
  canEdit,
  onEdit,
  currentDataSource,
  chatContext,
  onChangeChatContext,
}) => {

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
              <EmbeddingModelStorageView
                embeddingModelName={currentDataSource?.embedding_model_settings?.model_name}
                storage={currentDataSource?.storage}
              />
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