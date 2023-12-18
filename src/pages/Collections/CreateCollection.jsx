import Button from '@/components/Button';
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { useCreateCollectionMutation } from '@/api/collections';
import { useSelector } from 'react-redux';
import useCardNavigate from '@/components/useCardNavigate';
import { ContentType, ViewMode } from '@/common/constants';
import  AlertDialogV2 from '@/components/AlertDialogV2';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';
import { useNavigate  } from 'react-router-dom';

const validationSchema = yup.object({
  name: yup
    .string('Enter collection name')
    .required('Name is required'),
  description: yup
    .string('Enter collection description')
    .required('Description is required'),
});

export default function CreateCollection() {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const [doCreate, { data, isError, error }] = useCreateCollectionMutation();
  const navigate = useNavigate ();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: ({name, description}) => {
      doCreate({
        projectId: privateProjectId,
        name,
        description,
      });
    },
  });

  const onConfirmDiscard = React.useCallback(() => {
    navigate(-1)
  }, [navigate]);

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const onDiscard = React.useCallback(() => {
    setOpenConfirm(true);
  }, [setOpenConfirm]);

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
    <div style={{ maxWidth: 520, margin: 'auto', padding: '24px' }}>
      <Typography variant='headingMedium' component='div'>Create Collection</Typography>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput
          variant='standard'
          fullWidth
          id='name'
          name='name'
          label='Name'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <StyledInput
          variant='standard'
          fullWidth
          multiline
          maxRows={15}
          id='description'
          name='description'
          label='Description'
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <div style={{ marginTop: '28px' }} >
          <Button color='primary' variant='contained' type='submit' sx={{ mr: 1 }}>
            Create
          </Button>
          <Button color='secondary' variant='contained' onClick={onDiscard}>
            Cancel
          </Button>
        </div>
      </form>
      
      <AlertDialogV2
        open={openConfirm}
        setOpen={setOpenConfirm}
        title='Warning'
        content="Are you sure to drop the changes?"
        onConfirm={onConfirmDiscard}
      />
      <Toast
        open={isError}
        severity={'error'}
        message={buildErrorMessage(error)}
      />
    </div>
  );
}
