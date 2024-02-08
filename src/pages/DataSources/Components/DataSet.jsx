import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import { useNavBlocker } from "@/pages/hooks";
import { Box } from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import * as yup from 'yup';
import Source from "./Source";
import Transformers from "./Transformers";

const initialValues = {
  name: '',
  type: '',
};

const validationSchema = yup.object({
  name: yup
    .string('Enter dataset name')
    .required('Name is required'),
});

export default function DataSet({ handleChangeDataSet, data }) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => { },
  });

  const hasChange = useMemo(() => {
    return JSON.stringify(initialValues) !== JSON.stringify(formik.values);
  }, [formik.values]);


  const onCancel = useCallback(() => {
    setIsFormSubmit(true);
    formik.resetForm();
  }, [formik]);
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const onDiscard = useCallback(() => {
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
    <Box sx={{ width: '100%' }}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          id={'dataset-selected-checkbox'}
          label='New DataSets'
          checked={data?.selected}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={e => handleChangeDataSet(0, 'selected', e.target.checked)}
        />
      }>
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik} />
          <Transformers formik={formik} />

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
          onConfirm={onCancel}
        />

      </FilledAccordion>
    </Box>
  )
}