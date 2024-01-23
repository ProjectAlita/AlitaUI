import { usePublishCollectionMutation, useUnpublishCollectionMutation, useDeleteCollectionMutation } from '@/api/collections';
import { PromptStatus } from '@/common/constants';
import { useProjectId } from '@/pages/hooks';
import React from 'react';

const useCollectionActions = ({ collection }) => {
  const projectId = useProjectId();

  const allowPublish = React.useMemo(() => collection?.prompts?.rows?.filter(
    prompt => prompt.status === PromptStatus.Published
  ).length > 0, [collection?.prompts?.rows]);

  const [publishCollection, {
    isSuccess: isPublishSuccess,
    isLoading: isPublishLoading
  }] = usePublishCollectionMutation();
  const onConfirmPublish = React.useCallback(() => {
    publishCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, publishCollection, projectId]);

  const [unpublishCollection, {
    isSuccess: isUnpublishSuccess,
    isLoading: isUnpublishLoading
  }] = useUnpublishCollectionMutation();
  const onConfirmUnpublish = React.useCallback(() => {
    unpublishCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, projectId, unpublishCollection]);


  const [deleteCollection, {
    isSuccess: isDeleteSuccess,
    isLoading: isDeleteLoading
  }] = useDeleteCollectionMutation();
  const onConfirmDelete = React.useCallback(() => {
    deleteCollection({
      projectId,
      collectionId: collection?.id
    });
  }, [collection, deleteCollection, projectId]);

  const isPending = React.useMemo(() =>
    (isPublishLoading || isUnpublishLoading || isDeleteLoading)
    , [isPublishLoading, isUnpublishLoading, isDeleteLoading]);

  const isSuccess = React.useMemo(() =>
    (isPublishSuccess || isUnpublishSuccess || isDeleteSuccess)
    , [isPublishSuccess, isUnpublishSuccess, isDeleteSuccess]);

  
  const confirmPublishText = 'Are you sure you want to publish this collection?';
  const confirmUnpublishText = 'Are you sure you want to unpublish this collection?';
  const confirmDeleteText = 'Are you sure you want to delete this collection?';
  const blockPublishText = 'Please publish at least one prompt before publishing collection.';
  return {
    allowPublish,
    isPending,
    isSuccess,
    isPublishSuccess,
    isUnpublishSuccess,
    isDeleteSuccess,
    onConfirmPublish,
    onConfirmUnpublish,
    onConfirmDelete,
    confirmPublishText,
    confirmUnpublishText,
    confirmDeleteText,
    blockPublishText
  };
};

export default useCollectionActions;