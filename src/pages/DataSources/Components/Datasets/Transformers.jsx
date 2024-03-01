/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import SingleSelect from "@/components/SingleSelect";
import { extractors, splitters } from "@/pages/DataSources/constants.js";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback } from "react";
import FormikInput from "../Sources/FormikInput";

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


const splitterOptions = Object.values(splitters)

export const initialState = {
  extract_for_document: true,
  extract_for_chunks: false,
  extractor: extractors.bert.value,
  extractor_options: {
    strategy: strategies.max_sum.value,
    keyword_count: 5,
  },

  split_by: splitters.chunks.value,
  split_options: {
    chunk_size: 1000,
    chunk_overlap: 100,
    regex: ''
  }
}

export default function Transformers({ readOnly }) {
  const formik = useFormikContext();
  const {
    extract_for_document, extract_for_chunks, extractor,
    split_by, extractor_options, split_options
  } = formik.values.transformers || {}
  const { strategy, keyword_count } = extractor_options || {}
  const { chunk_size, chunk_overlap, regex } = split_options || {}
  const { transformers: errors } = formik.errors

  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('transformers.' + field, value)
  }, [formik.setFieldValue])



  return (
    <BasicAccordion
      defaultExpanded={false}
      items={[
        {
          title: 'Transformers',
          content: <Box
            sx={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px' }}>
            <CheckLabel
              label='Extract keywords for document'
              checked={extract_for_document}
              onChange={e => handleChange('extract_for_document', e.target.checked)}
              disabled={readOnly}
            />
            <CheckLabel
              label='Extract keywords for chunks'
              checked={extract_for_chunks}
              onChange={e => handleChange('extract_for_chunks', e.target.checked)}
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
              label='Keyword strategy'
              onValueChange={(value) => handleChange('extractor_options.strategy', value)}
              value={strategy}
              options={strategiesOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />}
            <FormikInput
              name='transformers.extractor_options.keyword_count'
              sx={{ paddingTop: '4px' }}
              label='Max keyword count'
              value={keyword_count}
              disabled={readOnly}
            />
            <SingleSelect
              showBorder
              label='Split by'
              onValueChange={(value) => handleChange('split_by', value)}
              value={split_by}
              options={splitterOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />
            <Box paddingTop={'4px'} display={"flex"} width={'100%'}>
              <FormikInput
                name='transformers.split_options.chunk_size'
                label='Chunk size'
                value={chunk_size}
                sx={{ pr: 1 }}
                disabled={readOnly}
              />
              <FormikInput
                name='transformers.split_options.chunk_overlap'
                label='Chunk overlap'
                value={chunk_overlap}
                sx={{ pl: 1 }}
                disabled={readOnly}
              />
            </Box>
            {split_by === splitters.paragraphs.value && <FormikInput
              name='transformers.split_options.regex'
              label='Regular expression'
              value={regex}
            />}
          </Box>
        }
      ]} />
  )
}