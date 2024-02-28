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
import useOptions from "./useOptions";
import { useFormikContext } from "formik";

const documentLoadersOptions = Object.values(documentLoaders)
export const initialState = {
  file: {},
  advanced: {
    split_pages: false,
    parse_tables_by_rows: false,
    default_loader: documentLoaders.textLoader.value,
    ext_whitelist: '',
    ext_blacklist: ''
  }
}

const SourceFile = ({ mode }) => {
  const { values, setFieldValue, handleBlur, handleChange: handleFieldChange } = useFormikContext();
  const options = useOptions({ initialState, setFieldValue, values, mode });
  const { advanced } = options
  const { split_pages, parse_tables_by_rows, default_loader, ext_whitelist, ext_blacklist } = advanced || {}

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur
  }), [handleBlur, handleFieldChange])

  const { isCreate } = useComponentMode(mode);
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);
  return (
    <>
      <FileUploadControl onChangeFile={(value) => handleChange('file', value)} />
      <BasicAccordion
        uppercase={false}
        defaultExpanded={false}
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