/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
import SingleSelect from "@/components/SingleSelect";
import {StyledInput} from '@/pages/EditPrompt/Common';
import {Box} from "@mui/material";
import SourceGit from "@/pages/DataSources/Components/Sources/SourceGit.jsx";


export const sourceTypes = {
    git: {
      label: 'Git',
      value: 'git'
    }
}

const typeOptions = Object.values(sourceTypes)


const Source = ({formik}) => {
  const {source: errors} = formik.errors
  const {name, type} = formik.values.source
  
  return (
    <BasicAccordion
      items={[
        {
          title: 'Source',
          content: <Box
            sx={{paddingLeft: '36px', display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '8px'}}>
            <StyledInput
              sx={{paddingTop: '4px'}}
              variant='standard'
              fullWidth
              required
              name='source.name'
              label='Name'
              value={name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!errors?.name}
              helperText={errors?.name || ''}
            />
            <SingleSelect
              showBorder
              name='source.type'
              label='Source type'
              onValueChange={(value) => formik.setFieldValue('source.type', value)}
              value={type}
              options={typeOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{marginTop: '8px'}}
            />
            {type === sourceTypes.git.value && 
              <SourceGit formik={formik}/>}
          </Box>
        }
      ]}/>
  )
}

export default Source