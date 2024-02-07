import BasicAccordion from "@/components/BasicAccordion";
import FileUploadControl from "@/components/FileUploadControl";
import SingleSelect from "@/components/SingleSelect";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";

const typeOptions = [
  {
    label: 'File',
    value: 'file'
  }, {
    label: 'Git',
    value: 'git'
  }
]


export default function Source({ formik }) {
  return (
    <BasicAccordion
      items={[
        {
          title: 'Source',
          content: <Box sx={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px' }}>
            <StyledInput
              sx={{ paddingTop: '4px' }}
              variant='standard'
              fullWidth
              id='name'
              name='name'
              label='Name'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <SingleSelect
              showBorder
              id='type'
              name='type'
              label='Source type'
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(value) => formik.setFieldValue('type', value)}
              value={formik.values.type}
              options={typeOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
            />
            <FileUploadControl />
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