/* eslint-disable react/jsx-no-bind */
import { useDatasetCreateMutation, useDatasetUpdateMutation } from "@/api/datasources.js";
import {ComponentMode, sioEvents, VITE_DEV_SERVER} from "@/common/constants";
import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import Summarization, { initialState as summarizationInitialState } from "./Summarization.jsx";
import { gitTypes, datasetStatus } from "@/pages/DataSources/constants.js";
import { useNavBlocker, useProjectId, useSelectedProjectId } from "@/pages/hooks";
import { Box } from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from 'yup';
import DataSetActions from "./DataSetActions";
import Source, { initialState as sourceState } from "../Sources/Source";
import Transformers, { initialState as transformersState } from "./Transformers";
import { buildErrorMessage, downloadFile } from "@/common/utils";
import useToast from "@/components/useToast";
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import StatusIcon from "./StatusIcon.jsx";
import { useManualSocket } from '@/hooks/useSocket.jsx';

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
  const { values, resetForm, isSubmitting } = useFormikContext();
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
      <Button disabled={isSubmitting} color='primary' variant='contained' type='submit' sx={{ mr: 1 }}>
        {submitButtonLabel}
        {isSubmitting && <StyledCircleProgress size={18} />}
      </Button>
      <Button disabled={isSubmitting} color='secondary' variant='contained' onClick={onDiscard}>
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

const ResponseHandler = ({
  isError,
  isSuccess,
  error
}) => {
  const { setErrors } = useFormikContext();
  const { ToastComponent: Toast, toastInfo, toastError } = useToast();
  useEffect(() => {
    if (isError) {
      if (Array.isArray(error?.data)) {
        const formikErrors = {};
        error.data.forEach((err) => {
          if (err?.loc?.length > 0) {
            formikErrors[err.loc.join('.')] = err.msg
          }
        })
        setErrors(formikErrors);
      } else {
        toastError(buildErrorMessage(error));
      }
    } else if (isSuccess) {
      toastInfo('Success');
    }
  }, [error, isError, isSuccess, setErrors, toastError, toastInfo]);
  return <Toast />
}

export const CreateDataset = ({ handleCancel, datasourceVersionId }) => {
  const projectId = useSelectedProjectId();
  const [createDataset, { isError, isSuccess, error }] = useDatasetCreateMutation();
  const handleSubmit = useCallback(async (values) => {
    await createDataset({
      ...values,
      datasource_version_id: datasourceVersionId,
      projectId,
    })
  }, [createDataset, datasourceVersionId, projectId])


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

              <ResponseHandler
                isError={isError}
                isSuccess={isSuccess}
                error={error}
              />
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
        type: data?.source_settings?.ssh_key ? gitTypes.ssh.value : gitTypes.https.value,
        ...(data?.source_settings || {}),
        extension_whitelist: data?.source_settings?.extension_whitelist ? data?.source_settings?.extension_whitelist.join(', ') : '',
        extension_blacklist: data?.source_settings?.extension_blacklist ? data?.source_settings?.extension_blacklist.join(', ') : '',
      }
    },
    transformers: data?.transformers || {},
    summarization: data?.summarization || {},
  }
};

const buildRequestBody = ({ source, transformers, summarization }, datasourceVersionId) => {
  return {
    datasource_version_id: datasourceVersionId,
    name: source?.name,
    source_type: source?.type,
    source_settings: source.options,
    transformers,
    summarization
  }
}

export const ViewEditDataset = ({ data, datasourceVersionId, datasourceVersionUUID }) => {
  const projectId = useProjectId();
  const [status, setStatus] = useState(data?.status);
  const [hasSubscribedStreaming, setHasSubscribedStreaming] = useState(false);
  const [updateDataSet, { isError, isSuccess, error }] = useDatasetUpdateMutation();
  const initialValues = useMemo(() => buildViewFormData(data), [data]);
  const [isEdit, setIsEdit] = useState(false);
  const mode = useMemo(() => isEdit ? ComponentMode.EDIT : ComponentMode.VIEW, [isEdit]);
  const { ToastComponent: Toast, toastInfo, toastError, toastSuccess } = useToast();
  const onStreamingEvent = useCallback(
    (message) => {
      if (message.status) {
        setStatus(message.status);
      }
    },
    [],
  )

  const { emit, subscribe, unsubscribe } = useManualSocket(sioEvents.datasource_dataset_status, onStreamingEvent);

  const onStopTask = useCallback(
    () => {
      setStatus(datasetStatus.stopped.value);
    },
    [],
  )

  useEffect(() => {
    if (
      [datasetStatus.preparing.value,
      datasetStatus.pending.value,
      datasetStatus.running.value].includes(status) && !hasSubscribedStreaming
    ) {
      subscribe();
      emit({ version_uuid: datasourceVersionUUID })
      setHasSubscribedStreaming(true);
    }
  }, [status, emit, onStreamingEvent, datasourceVersionUUID, hasSubscribedStreaming, subscribe])

  useEffect(() => {
    return () => {
      if (hasSubscribedStreaming) {
        unsubscribe();
      }
    }
  }, [hasSubscribedStreaming, unsubscribe])

  const handleCancel = useCallback(() => {
    setIsEdit(false);
  }, []);
  const handleSubmit = useCallback(async (values) => {
    setIsEdit(false);
    await updateDataSet({
      projectId,
      datasetId: data?.id,
      ...buildRequestBody(values, datasourceVersionId)
    })
  }, [updateDataSet, projectId, data?.id, datasourceVersionId])
  const doReIndex = useCallback(async (event) => {
    event.stopPropagation();
    await updateDataSet({
      projectId,
      datasetId: data?.id,
      datasource_version_id: datasourceVersionId
    })
  }, [updateDataSet, projectId, data?.id, datasourceVersionId])
  const downloadLogs = useCallback((event) => {
    event.stopPropagation();
    if (!data?.task_id) {
      return;
    }

    const filename = data?.task_id + '.log';
    const url = VITE_DEV_SERVER + '/api/v1/artifacts/artifact/default/' + projectId + '/dataset-logs/index_' + filename
    downloadFile({
      url,
      filename,
      handleError: (err) => {
        toastError('Download logs error: ' + err.message);
      }
    })
  }, [data?.task_id, projectId, toastError])

  // eslint-disable-next-line no-unused-vars
  const [isSelected, setIsSelected] = useState(false);
  const handleCheck = (event) => {
    // Prevent click from reaching the accordion
    event.stopPropagation();
    setIsSelected(event.target.checked);
  };

  const [expanded, setExpanded] = useState(false);
  const handleChange = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const turnToEdit = useCallback(() => {
    setExpanded(true)
    setIsEdit(true)
  }, [setIsEdit])


  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    } else if (isSuccess) {
      toastInfo('Success');
    }
  }, [error, isError, isSuccess, toastError, toastInfo]);

  useEffect(() => {
    if (hasSubscribedStreaming) {
      if (status === datasetStatus.error.value) {
        toastError('An error occurred while dataset creation!');
      } else if (status === datasetStatus.ready.value) {
        toastSuccess('Dataset was successfully created!');
      }
    }
  }, [error, hasSubscribedStreaming, isError, isSuccess, status, toastError, toastSuccess]);

  return (
    <Box sx={{ width: '100%' }}>
      <FilledAccordion
        expanded={expanded}
        onChange={handleChange}
        defaultExpanded={false}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <CheckLabel
              disabled
              checked
              label={data?.name}
              onClick={handleCheck}
            />
            <StatusIcon
              status={status}
              doReIndex={doReIndex}
              downloadLogs={downloadLogs}
            />
          </Box>
        }
        rightContent={isEdit ? null : <DataSetActions
          turnToEdit={turnToEdit}
          onStopTask={onStopTask}
          datasetId={data?.id}
          status={status}
        />}
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