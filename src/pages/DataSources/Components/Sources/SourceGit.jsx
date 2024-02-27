/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import GroupedButton from "@/components/GroupedButton";
import SingleSelect from "@/components/SingleSelect.jsx";
import useComponentMode from "@/components/useComponentMode";

import { documentLoaders, gitTypes } from "@/pages/DataSources/constants";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";
import { Box } from "@mui/material";
import { useCallback, useMemo } from "react";
import useOptions from "./useOptions";
import { useFormikContext } from "formik";

const documentLoadersOptions = Object.values(documentLoaders)

const gitTypeOptions = Object.values(gitTypes);

export const initialState = {
  url: '',
  branch: 'main',
  type: gitTypes.ssh.value,
  ssh_key: '',
  username: '',
  password: '',
  advanced: {
    default_loader: documentLoaders.textLoader.value,
    multithreading: false,
    ext_whitelist: '',
    ext_blacklist: ''
  }
}
const SourceGit = ({ mode }) => {
  const { values, setFieldValue, handleBlur, handleChange: handleFieldChange } = useFormikContext();
  const options = useOptions({ initialState, setFieldValue, values, mode });
  const {
    url = '',
    branch = 'main',
    type = gitTypes.ssh.value,
    ssh_key = '',
    username = '',
    password = '',
    advanced
  } = options
  const {
    default_loader = documentLoaders.textLoader.value,
    multithreading = false,
    ext_whitelist = '',
    ext_blacklist = ''
  } = advanced || {}
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur
  }), [handleBlur, handleFieldChange])

  const handleToggle = useCallback(e => {
    handleChange('type', e.target.value);
  }, [handleChange]);

  const { isCreate, isView } = useComponentMode(mode);

  return (
    <>
      <Box display={"flex"} width={'100%'}>
        <StyledInput
          required
          autoComplete={'off'}
          name='source.options.url'
          label='URL'
          value={url}
          sx={{ flexGrow: 1 }}
          {...inputProps}
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
      <StyledInput
        required
        autoComplete={'off'}
        name='source.options.branch'
        label='Branch'
        value={branch}
        {...inputProps}
        disabled={isView}
      />
      {type === gitTypes.ssh.value &&
        <StyledInput
          required
          name='source.options.ssh_key'
          autoComplete={'off'}
          label='SSH Key'
          value={ssh_key}
          {...inputProps}
          disabled={isView}
        />
      }
      {type === gitTypes.https.value &&
        <>
          <StyledInput
            name='source.options.username'
            autoComplete={'off'}
            label='Username'
            value={username}
            {...inputProps}
            disabled={isView}
          />
          <StyledInput
            name='source.options.password'
            type={'password'}
            autoComplete={'off'}
            label='Password'
            value={password}
            {...inputProps}
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
                  onChange={e => handleChange('advanced.multithreading', e.target.checked)}
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
export default SourceGit