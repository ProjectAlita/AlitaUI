/* eslint-disable react/jsx-no-bind */
import { useDatasetCreateMutation, useDatasetUpdateMutation } from "@/api/datasources.js";
import { ComponentMode } from "@/common/constants";
import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import Summarization, { initialState as summarizationInitialState } from "@/pages/DataSources/Components/Summarization.jsx";
import { documentLoaders, extractors, gitTypes, splitters } from "@/pages/DataSources/constants.js";
import { useNavBlocker, useProjectId, useSelectedProjectId } from "@/pages/hooks";
import { Box } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from 'yup';
import DataSetActions from "./DataSetActions";
import Source, { initialState as sourceState } from "./Source";
import Transformers, { initialState as transformersState } from "./Transformers";

const initialState = {
  source: sourceState,
  transformers: transformersState,
  summarization: summarizationInitialState
};

const validationSchema = yup.object({
  source: yup.object({
    name: yup.string('Enter dataset name').required('Name is required'),
    // options: yup.object({
    //   url: yup.string('Enter dataset url').required('Url is required'),
    //   branch: yup.string('Enter dataset branch').required('Branch is required'),
    // })
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
  const [createDataset] = useDatasetCreateMutation()
  const handleSubmit = useCallback(async (values) => {
    await createDataset({
      ...values,
      datasource_version_id: versionId,
      projectId,
    })
  }, [createDataset, versionId, projectId])

  return (
    <Box sx={{ width: '100%' }}>
      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnMount={false}
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
    </Box>
  )
}


const buildViewFormData = (data) => {
  return {
    source: {
      name: data?.name,
      type: data?.source_type,
      options: {
        url: data?.source_settings?.url,
        branch: data?.source_settings?.branch,
        type: data?.source_settings?.ssh_key ? gitTypes.ssh.value : gitTypes.https.value,
        ssh_key: data?.source_settings?.ssh_key,
        username: data?.source_settings?.username || '',
        password: data?.source_settings?.password || '',
        advanced: {
          multithreading: data?.source_settings?.advanced?.multithreading || false,
          default_loader: data?.source_settings?.advanced?.default_loader || documentLoaders.textLoader.value,
          ext_whitelist: data?.source_settings?.advanced?.ext_whitelist || '',
          ext_blacklist: data?.source_settings?.advanced?.ext_blacklist || '',
        }
      }
    },
    transformers: {
      extract_for_document: true,
      extract_for_chunks: true,
      extractor: extractors.bert.value,
      extractor_options: {
        // strategy: strategies.max_sum.value,
      },

      keywordCount: 5,
      split_by: splitters.chunks.value,
      split_options: {}
    },
    summarization: summarizationInitialState
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
  const [updateDataSet] = useDatasetUpdateMutation();
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

  const [isSelected, setIsSelected] = useState(false);
  const handleCheck = (event) => {
    // Prevent click from reaching the accordion
    event.stopPropagation();
    setIsSelected(event.target.checked);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FilledAccordion
        defaultExpanded={false}
        title={
          <CheckLabel
            disabled={isEdit}
            label={data?.name}
            checked={isSelected}
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
    </Box>
  )
}