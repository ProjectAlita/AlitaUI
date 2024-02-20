/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import SingleSelect from "@/components/SingleSelect";
import {Box} from "@mui/material";
import React, {useCallback} from "react";
import StyledInputEnhancer from "@/components/StyledInputEnhancer.jsx";
// import { extractors } from "@/pages/DataSources/constants";


// const extractorsOptions = Object.values(extractors)


const Summarization = ({formik, readOnly}) => {
  const {
    model, documentSummarization, documentSummarizationPrompt,
    chunkSummarization, chunkSummarizationPrompt
  } = formik.values.summarization
  // const errors = formik.errors.summarization || {}
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('summarization.' + field, value)
  }, [formik])
  

  return (
    <BasicAccordion
      items={[
        {
          title: 'Summarization',
          content: <Box
            sx={{paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px'}}
          >
            <SingleSelect
              showBorder
              label='Summarization model'
              onValueChange={(value) => handleChange('model', value)}
              value={model}
              options={[]}
              customSelectedFontSize={'0.875rem'}
              sx={{marginTop: '8px'}}
              disabled={readOnly}
            />
            <CheckLabel
              label='Document summarization'
              checked={documentSummarization}
              onChange={e => handleChange('documentSummarization', e.target.checked)}
              disabled={readOnly}
            />
            {documentSummarization && <StyledInputEnhancer
              autoComplete="off"
              showexpandicon={'true'}
              label={'Summarization prompt'}
              name={'summarization.documentSummarizationPrompt'}
              multiline
              maxRows={10}
              value={documentSummarizationPrompt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              containerProps={{width: '100%'}}
              editswitcher={readOnly}
              // error={!!descriptionError}
              // helperText={descriptionError}
            />}
            <CheckLabel
              label='Chunk summarization'
              checked={chunkSummarization}
              onChange={e => handleChange('chunkSummarization', e.target.checked)}
              disabled={readOnly}
            />
            {chunkSummarization && <StyledInputEnhancer
              autoComplete="off"
              showexpandicon={'true'}
              label={'Summarization prompt'}
              name={'summarization.chunkSummarizationPrompt'}
              multiline
              maxRows={10}
              value={chunkSummarizationPrompt}
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