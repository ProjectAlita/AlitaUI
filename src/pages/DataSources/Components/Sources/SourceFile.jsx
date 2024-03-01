/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from '@/components/CheckLabel';
import FileUploadControl from "@/components/FileUploadControl.jsx";
import SingleSelect from '@/components/SingleSelect';
import useComponentMode from '@/components/useComponentMode';
import { documentLoaders } from "@/pages/DataSources/constants";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback } from 'react';
import FormikInput from "./FormikInput";
import useOptions from "./useOptions";

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
  const { setFieldValue } = useFormikContext();
  const options = useOptions({ initialState, mode });
  const { advanced } = options
  const {
    split_pages = false,
    parse_tables_by_rows = false,
    default_loader = documentLoaders.textLoader.value,
    ext_whitelist = '',
    ext_blacklist = ''
  } = advanced || {}

  const { isCreate } = useComponentMode(mode);
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);
  return (
    <>
      <FileUploadControl onChangeFile={(value) => handleChange('file', value)} />
      <BasicAccordion
        style={{ width: '100%' }}
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
                <FormikInput
                  name='source.options.advanced.ext_whitelist'
                  label='Extension whitelist'
                  value={ext_whitelist}
                  disabled={!isCreate}
                />
                <FormikInput
                  name='source.options.advanced.ext_blacklist'
                  label='Extension blacklist'
                  value={ext_blacklist}
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