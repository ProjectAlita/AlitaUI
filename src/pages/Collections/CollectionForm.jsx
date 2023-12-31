import AlertDialogV2 from '@/components/AlertDialogV2';
import Button from '@/components/Button';
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { useNavBlocker } from '@/pages/hooks';

const validationSchema = yup.object({
  name: yup
    .string('Enter collection name')
    .required('Name is required'),
  description: yup
    .string('Enter collection description')
    .required('Description is required'),
});

export default function CollectionForm({ 
  initialValues, 
  onSubmit, 
  isCreate,
  isFormSubmit,
  onCancel 
}) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const hasChange = React.useMemo(() => {
    return JSON.stringify(initialValues) !== JSON.stringify(formik.values);
  }, [initialValues, formik.values]);


  const [openConfirm, setOpenConfirm] = React.useState(false);
  const onDiscard = React.useCallback(() => {
    if (hasChange) {
      setOpenConfirm(true);
    }
    else {
      formik.resetForm();
      onCancel();
    }
  }, [formik, hasChange, onCancel]);

  useNavBlocker({
    blockCondition: !isFormSubmit && hasChange
  });

  return (
    <div style={{ maxWidth: 520, margin: 'auto', padding: '24px' }}>
      <Typography variant='headingMedium' component='div'>{isCreate ? 'Create Collection' : 'Edit Collection'}</Typography>
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
            {isCreate ? 'Create' : 'Save'}
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
        onConfirm={onCancel}
      />
    </div>
  );
}
