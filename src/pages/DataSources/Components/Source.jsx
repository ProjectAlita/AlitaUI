/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion";
import SingleSelect from "@/components/SingleSelect";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";
import SourceGit, {initialState as gitInitialState} from "@/pages/DataSources/Components/Sources/SourceGit.jsx";
import { useMemo } from "react";
import { documentLoaders, gitTypes, sourceTypes } from "@/pages/DataSources/constants";

const typeOptions = Object.values(sourceTypes)

export const initialState = {
  name: '',
  type: sourceTypes.git.value,
  options: {
    ...gitInitialState
  }
}

const SourceContentBox = styled(Box)(() => ({
  paddingLeft: '36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'baseline',
  gap: '8px'
}));

const Source = ({ formik, readOnly }) => {
  const { source: errors } = formik.errors
  const { source: touched } = formik.touched
  const source = useMemo(() => formik?.values?.source, [formik?.values?.source])
  const { name, type } = source

  return (
    <BasicAccordion
      items={[
        {
          title: 'Source',
          content: <SourceContentBox>
            {
              !readOnly && <StyledInput
                sx={{ paddingTop: '4px' }}
                variant='standard'
                fullWidth
                required
                name='source.name'
                label='Name'
                value={name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!errors?.name && touched?.name}
                helperText={touched?.name ? errors?.name : ''}
              />
            }
            <SingleSelect
              showBorder
              name='source.type'
              label='Source type'
              onValueChange={(value) => formik.setFieldValue('source.type', value)}
              value={source?.type}
              options={typeOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={readOnly}
            />
            {source?.type === sourceTypes.git.value &&
              <SourceGit formik={formik} readOnly={readOnly} />}
          </SourceContentBox>
        }
      ]} />
  )
}

export default Source