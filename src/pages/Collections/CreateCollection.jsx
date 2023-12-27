import { useCreateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import React from 'react';
import { useSelector } from 'react-redux';
import CollectionForm from './CollectionForm';


export default function CreateCollection() {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const [doCreate, { data, isError, error }] = useCreateCollectionMutation();

  const initialValues = {
      name: '',
      description: '',
    };
    const onSubmit = React.useCallback(({name, description}) => {
      doCreate({
        projectId: privateProjectId,
        name,
        description,
      });
    }, [doCreate, privateProjectId]);

  const navigateToCollectionDetail = useCardNavigate({ 
    viewMode: ViewMode.Owner, 
    id: data?.id, 
    type: ContentType.MyLibraryCollections, 
    name: data?.name, 
    replace: true 
  });

  React.useEffect(() => {
    if (data?.id) {
      navigateToCollectionDetail();
    }
  }, [data, navigateToCollectionDetail]);

  return (
    <>
      <CollectionForm 
        initialValues={initialValues} 
        onSubmit={onSubmit} 
        isCreate={true}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}
