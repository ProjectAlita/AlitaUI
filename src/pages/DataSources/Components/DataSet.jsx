/* eslint-disable react/jsx-no-bind */
import { useDatasetCreateMutation, useDatasetUpdateMutation } from "@/api/datasources.js";
import { ComponentMode } from "@/common/constants";
import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import Summarization, { initialState as summarizationInitialState } from "@/pages/DataSources/Components/Summarization.jsx";
import { gitTypes } from "@/pages/DataSources/constants.js";
import { useNavBlocker, useProjectId, useSelectedProjectId } from "@/pages/hooks";
import { Box } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from 'yup';
import DataSetActions from "./DataSetActions";
import Source, { initialState as sourceState } from "./Source";
import Transformers, { initialState as transformersState } from "./Transformers";
import { buildErrorMessage } from "@/common/utils";
import useToast from "@/components/useToast";

const initialState = {
  source: sourceState,
  transformers: transformersState,
  summarization: summarizationInitialState
};

const validationSchema = yup.object({
  source: yup.object({
    name: yup.string('Enter dataset name').required('Name is required'),
  })
})

const FormWithBlocker = ({
  initialValues,
  submitButtonLabel,
  handleCancel,
  children,
  ...props
}) => {
  const { values, resetForm } = useFormikContext();
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const hasChange = useMemo(() => {
    return JSON.stringify(initialValues) !== JSON.stringify(values);
  }, [values, initialValues]);

  const blockOptions = useMemo(() => {
    return {
      blockCondition: !isFormSubmit && hasChange
    }
  }, [isFormSubmit, hasChange]);

  useNavBlocker(blockOptions);

  const onCancel = useCallback(() => {
    setIsFormSubmit(true);
    resetForm();
    handleCancel()
  }, [resetForm, handleCancel]);
  const onDiscard = useCallback(() => {
    if (hasChange) {
      setOpenConfirm(true);
    } else {
      resetForm();
      onCancel();
    }
  }, [resetForm, hasChange, onCancel]);

  return <Form {...props}>
    {children}
    {submitButtonLabel && <div style={{ marginTop: '28px' }}>
      <Button color='primary' variant='contained' type='submit' sx={{ mr: 1 }}>
        {submitButtonLabel}
      </Button>
      <Button color='secondary' variant='contained' onClick={onDiscard}>
        Cancel
      </Button>
      <AlertDialogV2
        open={openConfirm}
        setOpen={setOpenConfirm}
        title='Warning'
        content="Are you sure to drop the changes?"
        onConfirm={onCancel}
      />
    </div>
    }
  </Form>
}

export const CreateDataset = ({ handleCancel, versionId }) => {
  const projectId = useSelectedProjectId();
  const [createDataset, { isError, isSuccess, error }] = useDatasetCreateMutation();
  const handleSubmit = useCallback(async (values) => {
    await createDataset({
      ...values,
      datasource_version_id: versionId,
      projectId,
    })
  }, [createDataset, versionId, projectId])


  const { ToastComponent: Toast, toastInfo, toastError } = useToast();
  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    } else if (isSuccess) {
      toastInfo('Success');
    }
  }, [error, isError, isSuccess, toastError, toastInfo]);

  return (
    <Box sx={{ width: '100%' }}>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount={false}
        enableReinitialize
      >

        {
          ({ values }) =>
            <FilledAccordion title={
              <CheckLabel
                disabled
                label={values?.source?.name || 'New dataset'}
                checked
              />
            }>
              <FormWithBlocker
                id={'create-dataset-form'}
                handleCancel={handleCancel}
                initialValues={initialState}
                submitButtonLabel='Create'
              >
                <Source mode={ComponentMode.CREATE} />
                <Transformers readOnly={false} />
                <Summarization readOnly={false} />
              </FormWithBlocker>
            </FilledAccordion>
        }
      </Formik>

      <Toast />
    </Box>
  )
}


const buildViewFormData = (data) => {
  return {
    source: {
      name: data?.name,
      type: data?.source_type,
      options: {
        type: data?.source_settings?.ssh_key ? gitTypes.ssh.value : gitTypes.https.value,
        ...(data?.source_settings || {}),
      }
    },
    transformers: data?.transformers || {},
    summarization: data?.summarization || {},
  }
};

const buildRequestBody = ({ source, transformers, summarization }, datasourceId) => {
  return {
    datasource_version_id: datasourceId,
    name: source?.name,
    source_type: source?.type,
    source_settings: source.options,
    transformers,
    summarization
  }
}

export const ViewEditDataset = ({ data }) => {
  const { datasourceId } = useParams();
  const projectId = useProjectId();
  const [updateDataSet, { isError, isSuccess, error }] = useDatasetUpdateMutation();
  const initialValues = useMemo(() => buildViewFormData(data), [data]);
  const [isEdit, setIsEdit] = useState(false);
  const mode = useMemo(() => isEdit ? ComponentMode.EDIT : ComponentMode.VIEW, [isEdit]);

  const handleCancel = useCallback(() => {
    setIsEdit(false);
  }, []);
  const handleSubmit = useCallback(async (values) => {
    setIsEdit(false);
    await updateDataSet({
      projectId,
      datasetId: data?.id,
      ...buildRequestBody(values, datasourceId)
    })
  }, [updateDataSet, projectId, data?.id, datasourceId])

  // eslint-disable-next-line no-unused-vars
  const [isSelected, setIsSelected] = useState(false);
  const handleCheck = (event) => {
    // Prevent click from reaching the accordion
    event.stopPropagation();
    setIsSelected(event.target.checked);
  };


  const { ToastComponent: Toast, toastInfo, toastError } = useToast();
  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    } else if (isSuccess) {
      toastInfo('Success');
    }
  }, [error, isError, isSuccess, toastError, toastInfo]);
  return (
    <Box sx={{ width: '100%' }}>
      <FilledAccordion
        defaultExpanded={false}
        title={
          <CheckLabel
            disabled
            checked
            label={data?.name}
            onClick={handleCheck}
          />
        }
        rightContent={isEdit ? null : <DataSetActions setIsEdit={setIsEdit} datasetId={data?.id} />}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
        <FormWithBlocker
          id={'dataset-form' + data?.id}
          handleCancel={handleCancel}
          initialValues={initialValues}
          submitButtonLabel={isEdit ? 'Save' : ''}

        >
          <Source mode={mode} />
          <Transformers readOnly />
          <Summarization readOnly />
        </FormWithBlocker>
        </Formik>
      </FilledAccordion>
      
      <Toast />
    </Box>
  )
}