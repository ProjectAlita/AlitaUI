import { useGetCollectionQuery, useUpdateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CollectionForm from './CollectionForm';
import LoadingPage from '@/pages/LoadingPage';

export default function EditCollection() {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { collectionId } = useParams();
  const { data: initialData, error, isLoading, isSuccess } = useGetCollectionQuery({
    projectId: privateProjectId,
    collectionId
  }, { skip: !collectionId || !privateProjectId });

  const [doSave, { data: submitResponse, error: submitError }] = useUpdateCollectionMutation();
  const [isFormSubmit, setIsFormSubmit] = React.useState(false);

  const initialValues = {
    name: initialData?.name,
    description: initialData?.description,
  };
  const onSubmit = React.useCallback(({ name, description }) => {
    doSave({
      projectId: privateProjectId,
      collectionId,
      name,
      description,
      status: initialData?.status
    });
  }, [collectionId, doSave, initialData, privateProjectId]);

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
      { isLoading && <LoadingPage /> }
      <Toast
        open={error || submitError}
        severity={'error'}
        message={buildErrorMessage(error || submitError)}
      />
    </>
  );
}
