import { useGetCollectionQuery, useUpdateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import LoadingPage from '@/pages/LoadingPage';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelectedProjectId } from '../hooks';
import CollectionForm from './CollectionForm';

export default function EditCollection() {
  const selectedProjectId = useSelectedProjectId();
  const { collectionId } = useParams();
  const { data: initialData, error, isLoading, isSuccess } = useGetCollectionQuery({
    projectId: selectedProjectId,
    collectionId
  }, { skip: !collectionId || !selectedProjectId });

  const [doSave, { data: submitResponse, error: submitError }] = useUpdateCollectionMutation();
  const [isFormSubmit, setIsFormSubmit] = React.useState(false);

  const initialValues = {
    name: initialData?.name,
    description: initialData?.description,
  };
  const onSubmit = React.useCallback(({ name, description }) => {
    doSave({
      projectId: selectedProjectId,
      collectionId,
      name,
      description,
      status: initialData?.status
    });
  }, [collectionId, doSave, initialData, selectedProjectId]);

  const navigateBackToDetail = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: initialData?.id,
    type: ContentType.MyLibraryCollections,
    name: initialData?.name,
    replace: true
  });
  const onCancel = useCallback(() => {
    setIsFormSubmit(true);
    setTimeout(navigateBackToDetail, 100);
  }, [navigateBackToDetail]);

  const navigateToCollectionDetail = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: submitResponse?.id,
    type: ContentType.MyLibraryCollections,
    name: submitResponse?.name,
    replace: true
  });

  React.useEffect(() => {
    if (submitResponse?.id) {
      setIsFormSubmit(true);
      setTimeout(navigateToCollectionDetail, 100);
    }
  }, [submitResponse, navigateToCollectionDetail]);

  return (
    <>
      {
        isSuccess &&
        <CollectionForm
          initialValues={initialValues}
          isFormSubmit={isFormSubmit}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      }
      {isLoading && <LoadingPage />}
      <Toast
        open={error || submitError}
        severity={'error'}
        message={buildErrorMessage(error || submitError)}
      />
    </>
  );
}
