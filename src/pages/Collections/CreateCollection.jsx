import { useCreateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedProjectId } from '../hooks';
import CollectionForm from './CollectionForm';


export default function CreateCollection() {
  const navigate = useNavigate();
  const projectId = useSelectedProjectId();
  const [doCreate, { data, isError, error }] = useCreateCollectionMutation();
  const [isFormSubmit, setIsFormSubmit] = React.useState(false);

  const initialValues = {
    name: '',
    description: '',
  };
  const onSubmit = React.useCallback(({ name, description }) => {
    doCreate({
      projectId,
      name,
      description,
    });
  }, [doCreate, projectId]);

  const navigateToCollectionDetail = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: data?.id,
    type: ContentType.MyLibraryCollections,
    name: data?.name,
    replace: true
  });

  const onCancel = React.useCallback(() => {
    setIsFormSubmit(true);
    setTimeout(() => navigate(-1), 100);
  }, [navigate]);

  React.useEffect(() => {
    if (data?.id) {
      setIsFormSubmit(true);
      setTimeout(navigateToCollectionDetail, 100);
    }
  }, [data, navigateToCollectionDetail]);

  return (
    <>
      <CollectionForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isFormSubmit={isFormSubmit}
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
