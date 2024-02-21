/* eslint-disable */
import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import {useNavBlocker} from "@/pages/hooks";
import {Box} from "@mui/material";
import {useFormik} from "formik";
import {useCallback, useMemo, useState} from "react";
import * as yup from 'yup';
import Source, {initialState as sourceState} from "./Source";
import Transformers, {initialState as transformersState} from "./Transformers";
import Summarization, {initialState as summarizationInitialState} from "@/pages/DataSources/Components/Summarization.jsx";
import {documentLoaders, extractors, gitTypes, splitters} from "@/pages/DataSources/constants.js";
import {useDatasetCreateMutation} from "@/api/datasources.js";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const initialValues = {
  source: sourceState,
  transformers: transformersState,
  summarization: summarizationInitialState
};

const validationSchema = yup.object({
  source: yup.object({name: yup.string('Enter dataset name').required('Name is required'),})
})

export const CreateDataset = ({handleCancel, datasourceId, versionId}) => {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user)
  const [createDataset, {isFetching}] = useDatasetCreateMutation()
  const handleSubmit = useCallback(async (values) => {
    await createDataset({...values, datasource_version_id: versionId, projectId: privateProjectId})
  }, [versionId, privateProjectId])
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    validateOnMount: false
  });
  // window.f = formik

  const hasChange = useMemo(() => {
    return JSON.stringify(initialValues) !== JSON.stringify(formik.values);
  }, [formik.values]);

  const onCancel = useCallback(() => {
    setIsFormSubmit(true);
    formik.resetForm();
    handleCancel()
  }, [formik]);
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const onDiscard = useCallback(() => {
    if (hasChange) {
      setOpenConfirm(true);
    } else {
      formik.resetForm();
      onCancel();
    }
  }, [formik, hasChange, onCancel]);

  useNavBlocker({
    blockCondition: !isFormSubmit && hasChange
  });
  return (
    <Box sx={{width: '100%'}}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          label={formik.values?.source?.name || 'New dataset'}
          checked
          // onChange={e => handleChangeDataSet(0, 'selected', e.target.checked)}
        />
      }>
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik}/>
          <Transformers formik={formik}/>
          <Summarization formik={formik}/>

          <div style={{marginTop: '28px'}}>
            <Button color='primary' variant='contained' type='submit' sx={{mr: 1}}>
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

export function EditDataset({handleChangeDataSet, data}) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
    },
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
    } else {
      formik.resetForm();
      onCancel();
    }
  }, [formik, hasChange, onCancel]);

  useNavBlocker({
    blockCondition: !isFormSubmit && hasChange
  });
  return (
    <Box sx={{width: '100%'}}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          label={data?.name}
          checked
          // onChange={e => handleChangeDataSet(0, 'selected', e.target.checked)}
        />
      }>
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik}/>
          <Transformers formik={formik}/>

          <div style={{marginTop: '28px'}}>
            {/*<Button color='primary' variant='contained' type='submit' sx={{ mr: 1 }}>*/}
            {/*  Create*/}
            {/*</Button>*/}
            {/*<Button color='secondary' variant='contained' onClick={onDiscard}>*/}
            {/*  Cancel*/}
            {/*</Button>*/}
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
          username: data?.source_settings?.username,
          password: data?.source_settings?.password,
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

export const ViewDataset = ({ data }) => {
  const formik = useFormik({
    initialValues: buildViewFormData(data),
    onSubmit: () => {},
    handleBlur: () => {},
  });

  return (
    <Box sx={{ width: '100%' }}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          label={data?.name}
          checked
        />
      } defaultExpanded={false}
      >
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik} readOnly />
          <Transformers formik={formik} readOnly/>
          <Summarization formik={formik} readOnly/>
        </form>
      </FilledAccordion>
    </Box>
  )
}