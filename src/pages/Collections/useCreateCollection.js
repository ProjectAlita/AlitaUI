import { useCreateCollectionMutation } from '@/api/collections';
import { ContentType, ViewMode } from '@/common/constants';
import useCardNavigate from '@/components/useCardNavigate';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedProjectId } from '../hooks';


export default function useCreateCollection({ shouldNavigateToDetailAfterSuccess = true }) {
  const navigate = useNavigate();
  const projectId = useSelectedProjectId();
  const [doCreate, { data, isSuccess, isError, error, isLoading }] = useCreateCollectionMutation();
  const [isFormSubmit, setIsFormSubmit] = React.useState(false);


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
    if (shouldNavigateToDetailAfterSuccess && data?.id) {
      setIsFormSubmit(true);
      setTimeout(navigateToCollectionDetail, 100);
    }
  }, [data, navigateToCollectionDetail, shouldNavigateToDetailAfterSuccess]);

  return { onSubmit, onCancel, isFormSubmit, isSuccess, isError, error, isLoading};
}
