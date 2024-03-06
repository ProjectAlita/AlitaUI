import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import TagEditor from '@/pages/Prompts/Components/Form/TagEditor';
import NameDescriptionReadOnlyView from '@/components/NameDescriptionReadOnlyView';
import EmbeddingModelStorageView from './EmbeddingModelStorageView';

const DataSourceView = ({
  showProjectSelect = false,
  style,
  canEdit,
  onEdit,
  currentDataSource,
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
        }
      ]} />
  );
}

export default DataSourceView