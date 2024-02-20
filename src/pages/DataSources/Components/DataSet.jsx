/* eslint-disable */
import AlertDialogV2 from "@/components/AlertDialogV2";
import Button from '@/components/Button';
import CheckLabel from "@/components/CheckLabel";
import FilledAccordion from "@/components/FilledAccordion";
import Summarization from "@/pages/DataSources/Components/Summarization.jsx";
import { useNavBlocker } from "@/pages/hooks";
import { Box } from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import * as yup from 'yup';
import Source from "./Source";
import Transformers, { extractors, splitters } from "./Transformers";
import { documentLoaders, gitTypes } from "@/pages/DataSources/constants";
import { sourceTypes } from "@/pages/DataSources/constants";

const initialValues = {
  source: {
    name: '',
    type: sourceTypes.git.value,
    options: {
      url: '',
      branch: '',
      type: gitTypes.ssh.value,
      sshKey: '',
      username: '',
      password: '',
      advanced: {
        multithreading: false,
        defaultLoader: documentLoaders.TextLoader.value,
        extWhitelist: '',
        extBlacklist: '',
      }
    }
  },
  transformers: {
    extractForDocument: true,
    extractForChunks: true,
    extractor: extractors.bert.value,
    extractorOptions: {
      // strategy: strategies.max_sum.value,
    },

    keywordCount: 5,
    splitBy: splitters.chunks.value,
    splitOptions: {}
  },
  summarization: {
    documentSummarization: false,
    documentSummarizationPrompt: `You are acting as a code documentation expert for a project. Below is the code from a file that has the name '{fileName}'. Write a detailed technical explanation of what this code does. Create a constructor with a description of the input and output parameters of functions and objects Focus on the high-level purpose of the code and how it may be used in the larger project. Include code examples where appropriate. Keep you response between 100 and 300 words. DO NOT RETURN MORE THAN 300 WORDS. Output should be in markdown format. Do not just list the methods and classes in this file.
code: {fileContents}
Response:`,
    chunkSummarization: false,
    chunkSummarizationPrompt: `CODE: {code} 
__________________________________________ 
SUMMARIZATION: {summarization}`,
  }
};

const validationSchema = yup.object({
  source: yup.object({ name: yup.string('Enter dataset name').required('Name is required'), })
})

export const CreateDataset = ({ handleCancel }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // console.log('SUBMIT', values)
    },
  });
  window.f = formik

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
    <Box sx={{ width: '100%' }}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          label={formik.values?.source?.name || 'New dataset'}
          checked
        // onChange={e => handleChangeDataSet(0, 'selected', e.target.checked)}
        />
      }>
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik} />
          <Transformers formik={formik} />
          <Summarization formik={formik} />

          <div style={{ marginTop: '28px' }}>
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

export function EditDataset({ handleChangeDataSet, data }) {
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
    <Box sx={{ width: '100%' }}>
      <FilledAccordion title={
        <CheckLabel
          disabled
          label={data?.name}
          checked
        // onChange={e => handleChangeDataSet(0, 'selected', e.target.checked)}
        />
      }>
        <form onSubmit={formik.handleSubmit}>
          <Source formik={formik} />
          <Transformers formik={formik} />

          <div style={{ marginTop: '28px' }}>
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
          sshKey: data?.source_settings?.ssh_key,
          username: data?.source_settings?.username,
          password: data?.source_settings?.password,
          advanced: {
            multithreading: data?.source_settings?.advanced?.multithreading || false,
            defaultLoader: data?.source_settings?.advanced?.defaultLoader || documentLoaders.TextLoader.value,
            extWhitelist: data?.source_settings?.advanced?.extWhitelist || '',
            extBlacklist: data?.source_settings?.advanced?.extBlacklist || '',
          }
        }
      },
      transformers: {
        extractForDocument: true,
        extractForChunks: true,
        extractor: extractors.bert.value,
        extractorOptions: {
          // strategy: strategies.max_sum.value,
        },

        keywordCount: 5,
        splitBy: splitters.chunks.value,
        splitOptions: {}
      },
      summarization: {
        documentSummarization: false,
        documentSummarizationPrompt: `You are acting as a code documentation expert for a project. Below is the code from a file that has the name '{fileName}'. Write a detailed technical explanation of what this code does. Create a constructor with a description of the input and output parameters of functions and objects Focus on the high-level purpose of the code and how it may be used in the larger project. Include code examples where appropriate. Keep you response between 100 and 300 words. DO NOT RETURN MORE THAN 300 WORDS. Output should be in markdown format. Do not just list the methods and classes in this file.
    code: {fileContents}
    Response:`,
        chunkSummarization: false,
        chunkSummarizationPrompt: `CODE: {code} 
    __________________________________________ 
    SUMMARIZATION: {summarization}`,
      }
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