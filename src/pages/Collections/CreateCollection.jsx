import { buildErrorMessage } from '@/common/utils';
import Toast from '@/components/Toast';
import React from 'react';
import CollectionForm from './CollectionForm';
import useCreateCollection from './useCreateCollection';

export default function CreateCollection() {
  const { onSubmit, onCancel, isFormSubmit, isError, error, isLoading } =
    useCreateCollection({ shouldNavigateToDetailAfterSuccess: true })

  const initialValues = {
    name: '',
    description: '',
  };

  return (
    <>
      <CollectionForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isFormSubmit={isFormSubmit}
        isCreate={true}
        isLoading={isLoading}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </>
  );
}
