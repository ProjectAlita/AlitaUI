/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import SingleSelect from "@/components/SingleSelect";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";
import { useCallback, useEffect } from "react";

export const extractors = {
  bert: {
    label: 'KeyBert',
    value: 'bert'
  }
}

const extractorsOptions = Object.values(extractors)

const strategies = {
  max_sum: {
    label: 'Max sum',
    value: 'max_sum'
  },
  max_mmr_high: {
    label: 'Max mmr high',
    value: 'max_mmr_high'
  },
  max_mmr_low: {
    label: 'Max mmr low',
    value: 'max_mmr_low'
  },
}

const strategiesOptions = Object.values(strategies)

export const splitters = {
  chunks: {
    label: 'Chunks',
    value: 'chunks'
  },
  lines: {
    label: 'Lines',
    value: 'lines'
  },
  paragraphs: {
    label: 'Paragraphs',
    value: 'paragraphs'
  },
  sentences: {
    label: 'Sentences',
    value: 'sentences'
  }
}

const splitterOptions = Object.values(splitters)
export default function Transformers({ formik, readOnly }) {
  const {
    extractForDocument, extractForChunks, extractor,
    keywordCount, splitBy, extractorOptions, splitOptions
  } = formik.values.transformers
  const { transformers: errors } = formik.errors
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('transformers.' + field, value)
  }, [formik])
  useEffect(() => {
    switch (extractor) {
      case undefined:
        break
      case extractors.bert.value:
        !extractorOptions?.strategy && handleChange('extractorOptions', {
          strategy: strategies.max_sum.value
        })
        break
      default:
        handleChange('extractorOptions', {})
    }
  }, [extractor])

  useEffect(() => {
    switch (splitBy) {
      case undefined:
        break
      case splitters.chunks.value:
        !extractorOptions?.strategy && handleChange('splitOptions', {
          chunkSize: 1000,
          chunkOverlap: 100,
        })
        break
      default:
        handleChange('splitOptions', {})
    }
  }, [splitBy])

  return (
    <BasicAccordion
      items={[
        {
          title: 'Transformers',
          content: <Box
            sx={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px' }}>
            <CheckLabel
              label='Extract keywords for document'
              checked={extractForDocument}
              onChange={e => handleChange('extractForDocument', e.target.checked)}
              disabled={readOnly}
            />
            <CheckLabel
              label='Extract keywords for chunks'
              checked={extractForChunks}
              onChange={e => handleChange('extractForChunks', e.target.checked)}
              disabled={readOnly}
            />
            <SingleSelect
              showBorder
              label='Keyword extractor'
              onValueChange={(value) => handleChange('extractor', value)}
              value={extractor}
              options={extractorsOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />
            {extractor === extractors.bert.value && <SingleSelect
              showBorder
              label='Strategy'
              onValueChange={(value) => handleChange('extractorOptions.strategy', value)}
              value={extractorOptions.strategy}
              options={strategiesOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />}
            <StyledInput
              name='transformers.keywordCount'
              sx={{ paddingTop: '4px' }}
              variant='standard'
              fullWidth
              label='Max keyword count'
              value={keywordCount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={readOnly}
            />
            <SingleSelect
              showBorder
              label='Split by'
              onValueChange={(value) => handleChange('splitBy', value)}
              value={splitBy}
              options={splitterOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />
            {splitBy === splitters.chunks.value && (
              <Box paddingTop={'4px'} display={"flex"} width={'100%'}>
                <StyledInput
                  name='transformers.splitOptions.chunkSize'
                  variant='standard'
                  fullWidth
                  label='Chunk size'
                  value={splitOptions?.chunkSize || 1000}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ pr: 1 }}
                  disabled={readOnly}
                />
                <StyledInput
                  name='transformers.splitOptions.chunkOverlap'
                  variant='standard'
                  fullWidth
                  label='Chunk overlap'
                  value={splitOptions?.chunkOverlap || 100}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ pl: 1 }}
                  disabled={readOnly}
                />
              </Box>
            )}
          </Box>
        }
      ]} />
  )
}