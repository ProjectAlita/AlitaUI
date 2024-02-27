/* eslint-disable react/jsx-no-bind */
import FileUploadControl from "@/components/FileUploadControl.jsx";
import BasicAccordion from "@/components/BasicAccordion.jsx";
import { Box } from "@mui/material";
import CheckLabel from '@/components/CheckLabel';
import useComponentMode from '@/components/useComponentMode';
import { useCallback, useMemo } from 'react';
import SingleSelect from '@/components/SingleSelect';
import { documentLoaders } from "@/pages/DataSources/constants";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";

const documentLoadersOptions = Object.values(documentLoaders)

const SourceFile = ({ formik, mode }) => {
  const options = useMemo(() => formik.values.source?.options || {},
    [formik.values.source?.options]);
  const { advanced } = options
  const { split_pages, parse_tables_by_rows, default_loader, ext_whitelist, ext_blacklist } = advanced || {}

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: formik.handleChange,
    onBlur: formik.handleBlur
  }), [formik.handleBlur, formik.handleChange])

  const { isCreate } = useComponentMode(mode);
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('source.options.' + field, value)
  }, [formik]);
  return (
    <>
      <FileUploadControl />
      <BasicAccordion
        uppercase={false}
        items={[
          {
            title: 'Advanced settings',
            content: (
              <Box pl={3} width={'100%'}>
                <CheckLabel
                  disabled={!isCreate}
                  label='Split pages'
                  checked={split_pages || false}
                  onChange={e => handleChange('advanced.split_pages', e.target.checked)}
                />
                <CheckLabel
                  disabled={!isCreate}
                  label='Parse tables by rows'
                  checked={parse_tables_by_rows || false}
                  onChange={e => handleChange('advanced.parse_tables_by_rows', e.target.checked)}
                />
                <SingleSelect
                  showBorder
                  label='Default document loader'
                  onValueChange={(value) => handleChange('advanced.default_loader', value)}
                  value={default_loader}
                  options={documentLoadersOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{ marginTop: '8px' }}
                  disabled={!isCreate}
                />
                <StyledInput
                  name='source.options.advanced.ext_whitelist'
                  label='Extension whitelist'
                  value={ext_whitelist}
                  {...inputProps}
                  disabled={!isCreate}
                />
                <StyledInput
                  name='source.options.advanced.ext_blacklist'
                  label='Extension blacklist'
                  value={ext_blacklist}
                  {...inputProps}
                  disabled={!isCreate}
                />
              </Box>
            )
          }
        ]} />
    </>
  )
}
export default SourceFile