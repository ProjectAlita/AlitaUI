import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
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
          content:
            <div>
              <NameDescriptionReadOnlyView
                name={currentDataSource?.name}
                onClickEdit={onEdit}
                description={currentDataSource?.description}
                canEdit={canEdit}
                showProjectSelect={showProjectSelect}
                tags={currentDataSource?.version_details?.tags || []}
                id={currentDataSource?.id}
                idLabel='ID:'
              />
              <EmbeddingModelStorageView
                embeddingModelName={currentDataSource?.embedding_model_settings?.model_name}
                storage={currentDataSource?.storage}
              />
            </div>,
        }
      ]} />
  );
}

export default DataSourceView