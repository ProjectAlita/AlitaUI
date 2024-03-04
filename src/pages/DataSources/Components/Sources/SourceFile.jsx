/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from '@/components/CheckLabel';
import FileUploadControl from "@/components/FileUploadControl.jsx";
import SingleSelect from '@/components/SingleSelect';
import useComponentMode from '@/components/useComponentMode';
import {documentLoaders} from "@/pages/DataSources/constants";
import {Box} from "@mui/material";
import {useFormikContext} from "formik";
import {useCallback} from 'react';
import FormikInput from "./FormikInput";
import useOptions from "./useOptions";

const documentLoadersOptions = Object.values(documentLoaders)
export const initialState = {
  file: {},
  split_pages: false,
  parse_tables_by_rows: false,
  default_loader: documentLoaders.textLoader.value,
  extension_whitelist: '',
  extension_blacklist: ''
}

const SourceFile = ({mode}) => {
  const {setFieldValue} = useFormikContext();
  const options = useOptions({initialState, mode});
  const {
    file = {},
    split_pages = false,
    parse_tables_by_rows = false,
    default_loader = documentLoaders.textLoader.value,
    extension_whitelist = '',
    extension_blacklist = '',
  } = options

  const {isCreate} = useComponentMode(mode);
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);
  return (
    <>
      <FileUploadControl
        file={file}
        disabled={!isCreate}
        onChangeFile={(value) => handleChange('file', value)}
      />
      <BasicAccordion
        style={{width: '100%'}}
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
                  onChange={e => handleChange('split_pages', e.target.checked)}
                />
                <CheckLabel
                  disabled={!isCreate}
                  label='Parse tables by rows'
                  checked={parse_tables_by_rows || false}
                  onChange={e => handleChange('parse_tables_by_rows', e.target.checked)}
                />
                <SingleSelect
                  showBorder
                  label='Default document loader'
                  onValueChange={(value) => handleChange('default_loader', value)}
                  value={default_loader}
                  options={documentLoadersOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{marginTop: '8px'}}
                  disabled={!isCreate}
                />
                <FormikInput
                  name='source.options.extension_whitelist'
                  label='Extension whitelist'
                  value={extension_whitelist}
                  disabled={!isCreate}
                />
                <FormikInput
                  name='source.options.extension_blacklist'
                  label='Extension blacklist'
                  value={extension_blacklist}
                  disabled={!isCreate}
                />
              </Box>
            )
          }
        ]}/>
    </>
  )
}
export default SourceFile