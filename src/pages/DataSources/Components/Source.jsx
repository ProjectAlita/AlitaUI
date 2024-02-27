/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import SingleSelect from "@/components/SingleSelect";
import useComponentMode from "@/components/useComponentMode";
import SourceFile from "@/pages/DataSources/Components/Sources/SourceFile";
import SourceGit, { initialState as gitInitialState } from "@/pages/DataSources/Components/Sources/SourceGit.jsx";
import SourceJira from "@/pages/DataSources/Components/Sources/SourceJira";
import SourceConfluence, { initialState as confluenceInitialState } from "@/pages/DataSources/Components/Sources/SourceConfluence";
import { sourceTypes } from "@/pages/DataSources/constants";
import { StyledInput } from '@/pages/EditPrompt/Common';
import { Box } from "@mui/material";
import { useMemo } from "react";
import { useFormikContext } from "formik";
import SourceTable from "@/pages/DataSources/Components/Sources/SourceTable.jsx";

const typeOptions = Object.values(sourceTypes)
  .filter(type => [
    sourceTypes.git.value, sourceTypes.confluence.value, sourceTypes.table.value
  ].includes(type.value))

export const initialState = {
  name: '',
  type: sourceTypes.git.value,
  options: {
    ...confluenceInitialState,
    ...gitInitialState,
    advanced: {
      ...confluenceInitialState.advanced,
      ...gitInitialState.advanced
    }
  }
}

const SourceContentBox = styled(Box)(() => ({
  paddingLeft: '36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'baseline',
  gap: '8px'
}));

const Source = ({ mode }) => {
  const formik = useFormikContext();
  const { source: errors } = formik.errors || {}
  const { source: touched } = formik.touched || {}
  const name = useMemo(() => formik?.values?.source?.name, [formik?.values?.source]);
  const type = useMemo(() => formik?.values?.source?.type, [formik?.values?.source]);

  const { isCreate, isView } = useComponentMode(mode);
  return (
    <BasicAccordion
      items={[
        {
          title: 'Source',
          content: <SourceContentBox>
            {
              (!isView) && <StyledInput
                sx={{ paddingTop: '4px' }}
                variant='standard'
                fullWidth
                required
                autoComplete={'off'}
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
              value={type}
              options={typeOptions}
              customSelectedFontSize={'0.875rem'}
              sx={{ marginTop: '8px' }}
              disabled={!isCreate}
            />
            {type === sourceTypes.file.value &&
              <SourceFile formik={formik} mode={mode} />}
            {type === sourceTypes.git.value &&
              <SourceGit formik={formik} mode={mode} />}
            {type === sourceTypes.jira.value &&
              <SourceJira formik={formik} mode={mode} />}
            {type === sourceTypes.confluence.value &&
              <SourceConfluence formik={formik} mode={mode} />}
            {type === sourceTypes.table.value &&
              <SourceTable formik={formik} mode={mode} />}
          </SourceContentBox>
        }
      ]} />
  )
}

export default Source