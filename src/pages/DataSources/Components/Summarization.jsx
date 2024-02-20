/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import {Alert, Box} from "@mui/material";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import StyledInputEnhancer from "@/components/StyledInputEnhancer.jsx";
import {useGetModelsQuery} from "@/api/integrations.js";
import {useSelector} from "react-redux";
import SingleGroupSelect from "@/components/SingleGroupSelect.jsx";
import {genModelSelectValue} from "@/common/promptApiUtils.js";

export const initialState = {
  document_summarization: false,
  document_summarization_prompt: `You are acting as a code documentation expert for a project. Below is the code from a file that has the name '{fileName}'. Write a detailed technical explanation of what this code does. Create a constructor with a description of the input and output parameters of functions and objects Focus on the high-level purpose of the code and how it may be used in the larger project. Include code examples where appropriate. Keep you response between 100 and 300 words. DO NOT RETURN MORE THAN 300 WORDS. Output should be in markdown format. Do not just list the methods and classes in this file.
code: {fileContents}
Response:`,
  chunk_summarization: false,
  chunk_summarization_prompt: `CODE: {code} 
__________________________________________ 
SUMMARIZATION: {summarization}`,
}


const Summarization = ({formik, readOnly}) => {
  const {
    model, document_summarization, document_summarization_prompt,
    chunk_summarization, chunk_summarization_prompt
  } = formik.values.summarization
  // const errors = formik.errors.summarization || {}
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('summarization.' + field, value)
  }, [formik])
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { isSuccess, data: integrations } = useGetModelsQuery(privateProjectId, { skip: !privateProjectId })
  
  const [modelOptions, setModelOptions] = useState({})
  useEffect(() => {
    if (isSuccess && integrations && integrations.length) {
      const configNameModelMap = integrations.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.config.name]: item.settings.models?.map(
            ({ name: modelName, id }) => ({
              label: modelName,
              value: id,
              group: item.uid,
              group_name: item.name,
              config_name: item.config.name,
              project_id: item.project_id
            })),
        };
      }, {});
      setModelOptions(configNameModelMap);
    }
  }, [integrations, isSuccess]);

  const onChangeModel = useCallback(
    (integrationUid, selModelName, integrationName) => {
      handleChange('model', {
        integration_uid: integrationUid,
        integration_name: integrationName,
        model_name: selModelName,
        // project_id: project_id
      })
    },
    [handleChange]
  );
  const selectedModel = useMemo(() =>
      (model?.integration_uid && model?.model_name ? genModelSelectValue(model?.integration_uid, model?.model_name, model?.integration_name) : '')
    , [model?.integration_name, model?.integration_uid, model?.model_name]);

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
              // error={!!descriptionError}
              // helperText={descriptionError}
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
              // error={!!descriptionError}
              // helperText={descriptionError}
            />}
            
          </Box>
        }
      ]}/>
  )
}

export default Summarization