import { useGetCollectionQuery, useUpdateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import useCardNavigate from '@/components/useCardNavigate';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CollectionForm from './CollectionForm';

export default function EditCollection() {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { collectionId } = useParams();
  const { data: initialData, error } = useGetCollectionQuery({
    projectId: privateProjectId,
    collectionId
  }, { skip: !collectionId || !privateProjectId });

  const [doSave, { data: submitResponse, error: submitError }] = useUpdateCollectionMutation();

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

  const navigateToCollectionDetail = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: submitResponse?.id,
    type: ContentType.MyLibraryCollections,
    name: submitResponse?.name,
    replace: true
  });

  React.useEffect(() => {
    if (submitResponse?.id) {
      navigateToCollectionDetail();
    }
  }, [submitResponse, navigateToCollectionDetail]);

  return (
    <>
      <CollectionForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={navigateBackToDetail}
      />
      <Toast
        open={error || submitError}
        severity={'error'}
        message={buildErrorMessage(error || submitError)}
      />
    </>
  );
}
