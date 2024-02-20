/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import SingleSelect from "@/components/SingleSelect";
import SourceGit from "@/pages/DataSources/Components/Sources/SourceGit.jsx";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";
import { useMemo } from "react";
import { sourceTypes } from "@/pages/DataSources/constants";

const typeOptions = Object.values(sourceTypes)

const SourceContentBox = styled(Box)(() => ({
  paddingLeft: '36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'baseline',
  gap: '8px'
}));

const Source = ({ formik, readOnly }) => {
  const { source: errors } = formik.errors
  const source = useMemo(() => formik?.values?.source, [formik?.values?.source])

  return (
    <BasicAccordion
      items={[
        {
          title: 'Source',
          content: <SourceContentBox>
            {
              !readOnly &&
              <StyledInput
                sx={{ paddingTop: '4px' }}
                variant='standard'
                fullWidth
                required
                name='source.name'
                label='Name'
                value={source?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!errors?.name}
                helperText={errors?.name || ''}
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