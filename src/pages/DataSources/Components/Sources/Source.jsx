/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion";
import SingleSelect from "@/components/SingleSelect";
import useComponentMode from "@/components/useComponentMode";
import SourceConfluence from "@/pages/DataSources/Components/Sources/SourceConfluence";
import SourceFile from "@/pages/DataSources/Components/Sources/SourceFile";
import SourceGit from "@/pages/DataSources/Components/Sources/SourceGit.jsx";
import SourceJira from "@/pages/DataSources/Components/Sources/SourceJira";
import SourceTable from "@/pages/DataSources/Components/Sources/SourceTable.jsx";
import { sourceTypes } from "@/pages/DataSources/constants";
import { StyledInput } from '@/pages/Prompts/Components/Common';
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo } from "react";

const typeOptions = Object.values(sourceTypes)
  .filter(type => [
    sourceTypes.git.value, sourceTypes.confluence.value, sourceTypes.file.value, sourceTypes.table.value
  ].includes(type.value))

export const initialState = {
  name: '',
  type: sourceTypes.git.value,
  options: null
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
              <SourceFile mode={mode} />}
            {type === sourceTypes.git.value &&
              <SourceGit mode={mode} />}
            {type === sourceTypes.jira.value &&
              <SourceJira mode={mode} />}
            {type === sourceTypes.confluence.value &&
              <SourceConfluence mode={mode} />}
            {type === sourceTypes.table.value &&
              <SourceTable mode={mode} />}
          </SourceContentBox>
        }
      ]} />
  )
}

export default Source