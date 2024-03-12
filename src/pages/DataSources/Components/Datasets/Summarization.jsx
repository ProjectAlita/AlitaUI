/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import {Alert, Box} from "@mui/material";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import StyledInputEnhancer from "@/components/StyledInputEnhancer.jsx";
import {useGetModelsQuery} from "@/api/integrations.js";
import SingleGroupSelect from "@/components/SingleGroupSelect.jsx";
import {genModelSelectValue} from "@/common/promptApiUtils.js";
import {getIntegrationOptions} from "@/pages/DataSources/utils.js";
import {useSelectedProjectId} from "@/pages/hooks.jsx";
import { useFormikContext } from "formik";

export const initialState = {
  document_summarization: false,
  document_summarization_prompt: `You are acting as a code documentation expert for a project. Below is the code from a file that has the name '{fileName}'. Write a detailed technical explanation of what this code does. Create a constructor with a description of the input and output parameters of functions and objects Focus on the high-level purpose of the code and how it may be used in the larger project. Include code examples where appropriate. Keep you response between 100 and 300 words. DO NOT RETURN MORE THAN 300 WORDS. Output should be in markdown format. Do not just list the methods and classes in this file.
code: {fileContents}
Response:`,
  chunk_summarization: false,
  chunk_summarization_prompt: `CODE: {code} 
__________________________________________ 
SUMMARIZATION: {summarization}`,
  ai_model_name: '',
  ai_integration_uid: '',
}


const Summarization = ({readOnly}) => {
  const formik = useFormikContext();
  const {
    document_summarization, document_summarization_prompt,
    chunk_summarization, chunk_summarization_prompt,
    ai_model_name, ai_integration_uid
  } = formik.values.summarization
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('summarization.' + field, value)
  }, [formik])
  const currentProjectId = useSelectedProjectId()
  const { isSuccess, data: integrations } = useGetModelsQuery(currentProjectId, { skip: !currentProjectId })
  
  const [modelOptions, setModelOptions] = useState({})
  useEffect(() => {
    if (isSuccess && integrations && integrations.length) {
      setModelOptions(getIntegrationOptions(integrations, ['chat_completion', 'completion']));
    }
  }, [integrations, isSuccess]);

  const onChangeModel = useCallback(
    (integrationUid, selModelName) => {
      handleChange('ai_model_name', selModelName)
      handleChange('ai_integration_uid', integrationUid)
    },
    [handleChange]
  );
  const selectedModel = useMemo(() =>
      (ai_model_name && ai_integration_uid ? genModelSelectValue(ai_integration_uid, ai_model_name, ) : '')
    , [ai_integration_uid, ai_model_name]);

  return (
    <BasicAccordion
      defaultExpanded={false}
      items={[
        {
          title: 'Summarization',
          content: <Box
            sx={{paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px'}}
          >
            <Alert severity="warning" sx={{width: '100%'}}>Summarization comes at a high cost!</Alert>
            <SingleGroupSelect
              label={'Summarization model'}
              value={selectedModel}
              onValueChange={onChangeModel}
              options={modelOptions}
              disabled={readOnly}
            />
            <CheckLabel
              label='Document summarization'
              checked={document_summarization}
              onChange={e => handleChange('document_summarization', e.target.checked)}
              disabled={readOnly}
            />
            {document_summarization && <StyledInputEnhancer
              autoComplete="off"
              showexpandicon={'true'}
              label={'Summarization prompt'}
              name={'summarization.document_summarization_prompt'}
              multiline
              maxRows={10}
              value={document_summarization_prompt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              containerProps={{width: '100%'}}
              editswitcher={readOnly}
            />}
            <CheckLabel
              label='Chunk summarization'
              checked={chunk_summarization}
              onChange={e => handleChange('chunk_summarization', e.target.checked)}
              disabled={readOnly}
            />
            {chunk_summarization && <StyledInputEnhancer
              autoComplete="off"
              showexpandicon={'true'}
              label={'Summarization prompt'}
              name={'summarization.chunk_summarization_prompt'}
              multiline
              maxRows={10}
              value={chunk_summarization_prompt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              containerProps={{width: '100%'}}
              editswitcher={readOnly}
            />}
            
          </Box>
        }
      ]}/>
  )
}

export default Summarization