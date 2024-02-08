import BasicAccordion from "@/components/BasicAccordion";
import CheckLabel from "@/components/CheckLabel";
import SingleSelect from "@/components/SingleSelect";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";

export default function Transformers({ formik }) {
  return (
    <BasicAccordion
      items={[
        {
          title: 'Transformers',
          content: <Box sx={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px' }}>
            <CheckLabel
              id={'extract-for-document'}
              label='Extract keywords for document'
              checked={formik.values.extractForDocument}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={e => formik.setFieldValue('extractForDocument', e.target.checked)}
            />
            <CheckLabel
              id={'extract-for-chunks'}
              label='Extract keywords for chunks'
              checked={formik.values.extractForChunks}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={e => formik.setFieldValue('extractForChunks', e.target.checked)}
            />
            <SingleSelect
              showBorder
              id='extractor'
              name='extractor'
              label='Keyword extractor'
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(value) => formik.setFieldValue('extractor', value)}
              value={formik.values.type}
              options={[]}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
            />
            <SingleSelect
              showBorder
              id='strategy'
              name='strategy'
              label='Strategy'
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(value) => formik.setFieldValue('strategy', value)}
              value={formik.values.type}
              options={[]}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
            />
            <StyledInput
              sx={{ paddingTop: '4px' }}
              variant='standard'
              fullWidth
              id='keywordCount'
              name='keywordCount'
              label='Max keyword count'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <SingleSelect
              showBorder
              id='splitBy'
              name='splitBy'
              label='Split by'
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(value) => formik.setFieldValue('splitBy', value)}
              value={formik.values.splitBy}
              options={[]}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
            />
            <StyledInput
              sx={{ paddingTop: '4px' }}
              variant='standard'
              fullWidth
              id='chunkSize'
              name='chunkSize'
              label='Chunk size'
              value={formik.values.chunkSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <BasicAccordion
              uppercase={false}
              items={[
                {
                  title: 'Advanced settings',
                  content: <Box>Advanced settings</Box>
                }
              ]} />
          </Box>
        }
      ]} />
  )
}