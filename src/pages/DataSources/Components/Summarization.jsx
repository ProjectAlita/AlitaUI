/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import SingleSelect from "@/components/SingleSelect";
import {Box} from "@mui/material";
import React, {useCallback} from "react";
import StyledInputEnhancer from "@/components/StyledInputEnhancer.jsx";

export const extractors = {
  bert: {
    label: 'KeyBert',
    value: 'bert'
  }
}

const extractorsOptions = Object.values(extractors)


const Summarization = ({formik}) => {
  const {
    model, documentSummarization, documentSummarizationPrompt,
    chunkSummarization, chunkSummarizationPrompt
  } = formik.values.summarization
  const errors = formik.errors.summarization || {}
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
            />
            <CheckLabel
              label='Document summarization'
              checked={documentSummarization}
              onChange={e => handleChange('documentSummarization', e.target.checked)}
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
              // error={!!descriptionError}
              // helperText={descriptionError}
            />}
            <CheckLabel
              label='Chunk summarization'
              checked={chunkSummarization}
              onChange={e => handleChange('chunkSummarization', e.target.checked)}
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
              // error={!!descriptionError}
              // helperText={descriptionError}
            />}
          </Box>
        }
      ]}/>
  )
}

export default Summarization