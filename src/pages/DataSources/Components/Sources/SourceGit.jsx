/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import GroupedButton from "@/components/GroupedButton";
import SingleSelect from "@/components/SingleSelect.jsx";
import useComponentMode from "@/components/useComponentMode";

import { documentLoaders, gitTypes } from "@/pages/DataSources/constants";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback } from "react";
import FormikInput from "./FormikInput";
import useOptions from "./useOptions";

const documentLoadersOptions = Object.values(documentLoaders)

const gitTypeOptions = Object.values(gitTypes);

export const initialState = {
  url: '',
  branch: 'main',
  type: gitTypes.ssh.value,
  ssh_key: undefined,
  username: undefined,
  password: undefined,
  default_loader: documentLoaders.textLoader.value,
  multithreading: false,
  extension_whitelist: '',
  extension_blacklist: ''
}
const SourceGit = ({ mode }) => {
  const { setFieldValue } = useFormikContext();
  const options = useOptions({ initialState, mode });
  const {
    url = '',
    branch = 'main',
    type = gitTypes.ssh.value,
    ssh_key = '',
    username = '',
    password = '',
    default_loader = documentLoaders.textLoader.value,
    multithreading = false,
    extension_whitelist = '',
    extension_blacklist = ''
  } = options
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);

  const handleToggle = useCallback(e => {
    handleChange('type', e.target.value);
    if (e.target.value === gitTypes.ssh.value) {
      setFieldValue('source.options.username', undefined)
      setFieldValue('source.options.password', undefined)
    } else {
      setFieldValue('source.options.ssh_key', undefined)
    }
  }, [handleChange, setFieldValue]);

  const { isCreate, isView } = useComponentMode(mode);

  return (
    <>
      <Box display={"flex"} width={'100%'}>
        <FormikInput
          required
          name='source.options.url'
          label='URL'
          value={url}
          sx={{ flexGrow: 1 }}
          disabled={!isCreate}
        />
        <Box alignSelf={'end'}>
          <GroupedButton
            value={type}
            onChange={handleToggle}
            readOnly={isView}
            buttonItems={gitTypeOptions}
          />
        </Box>
      </Box>
      <FormikInput
        required
        name='source.options.branch'
        label='Branch'
        value={branch}
        disabled={isView}
      />
      {type === gitTypes.ssh.value &&
        <FormikInput
          required
          name='source.options.ssh_key'
          label='SSH Key'
          value={ssh_key}
          disabled={isView}
        />
      }
      {type === gitTypes.https.value &&
        <>
          <FormikInput
            name='source.options.username'
            label='Username'
            value={username}
            disabled={isView}
          />
          <FormikInput
            name='source.options.password'
            type={'password'}
            label='Password'
            value={password}
            disabled={isView}
          />
        </>
      }
      <BasicAccordion
        uppercase={false}
        style={{ width: '100%' }}
        defaultExpanded={false}
        items={[
          {
            title: 'Advanced settings',
            content: (
              <Box pl={3} width={'100%'}>
                <CheckLabel
                  disabled={!isCreate}
                  label='Multithreading'
                  checked={multithreading || false}
                  onChange={e => handleChange('multithreading', e.target.checked)}
                />
                <SingleSelect
                  showBorder
                  label='Default document loader'
                  onValueChange={(value) => handleChange('default_loader', value)}
                  value={default_loader}
                  options={documentLoadersOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{ marginTop: '8px' }}
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
        ]} />
    </>
  )
}
export default SourceGit