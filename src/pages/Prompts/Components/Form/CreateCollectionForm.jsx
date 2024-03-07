import AlertDialogV2 from '@/components/AlertDialogV2';
import Button from '@/components/Button';
import { StyledInput } from '@/pages/Prompts/Components/Common';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Box } from '@mui/material';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';

const validationSchema = yup.object({
  name: yup
    .string('Enter collection name')
    .required('Name is required'),
  description: yup
    .string('Enter collection description')
    .required('Description is required'),
});

export default function CreateCollectionForm({
  onSubmit,
  onCancel,
  isLoading,
}) {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit,
  });

  const hasChange = React.useMemo(() => {
    return JSON.stringify({
      name: '',
      description: '',
    }) !== JSON.stringify(formik.values);
  }, [formik.values]);

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

  return (
    <Box sx={{ width: '100%', paddingInline: '12px', paddingBottom: '24px' }}>
      <form onSubmit={formik.handleSubmit}>
        <StyledInput
          variant='standard'
          fullWidth
          id='name'
          name='name'
          label='Collection name'
          required
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
          required
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
          <Button disabled={!formik.values.name || !formik.values.description || isLoading} color='primary' variant='contained' type='submit' sx={{ mr: 1 }}>
            Create
            {isLoading && <StyledCircleProgress size={16} />}
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
    </Box>
  );
}
