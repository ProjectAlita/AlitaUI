/* eslint-disable */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import SingleSelect from "@/components/SingleSelect.jsx";

import { gitTypes, documentLoaders } from "@/pages/DataSources/constants";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {useCallback, useEffect, useMemo} from "react";

const documentLoadersOptions = Object.values(documentLoaders)

const gitTypeOptions = Object.values(gitTypes)

const initialState = {
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
const SourceGit = ({ formik, readOnly }) => {
  useEffect(() => {
    formik.setFieldValue('source.options', initialState)
  }, [formik.setFieldValue])
  
  const {url, branch, type, ssh_key, username, password, advanced} = formik.values.source?.options
  const {multithreading, default_loader, ext_whitelist, ext_blacklist} = advanced || {}
  // const errors = formik.errors.source
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('source.options.' + field, value)
  }, [formik.setFieldValue])


  const inputProps = useMemo(() => ({
    disabled: readOnly,
    fullWidth: true,
    variant: 'standard',
    onChange: formik.handleChange,
    onBlur: formik.handleBlur
  }), [formik.handleBlur, formik.handleChange, readOnly])

  const handleToggle = useCallback(e => {
    handleChange('type', e.target.value);
  }, [handleChange]);

  return (
    <>
      <Box display={"flex"} width={'100%'}>
        <StyledInput
          name='source.options.url'
          label='URL'
          value={url}
          sx={{ flexGrow: 1 }}
          {...inputProps}
        />
        <Box alignSelf={'end'}>
          <ToggleButtonGroup
            size="small"
            value={type}
            onChange={readOnly ? undefined : handleToggle}
          >
            {gitTypeOptions.map(i => (
              <ToggleButton
                key={i.value}
                value={i.value}
                disabled={readOnly}
              >
                {i.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <StyledInput
        name='source.options.branch'
        label='Branch'
        value={branch}
        {...inputProps}
      />
      {type === gitTypes.ssh.value &&
        <StyledInput
          required
          name='source.options.ssh_key'
          label='SSH Key'
          value={ssh_key}
          {...inputProps}
        />
      }
      {type === gitTypes.https.value &&
        <>
          <StyledInput
            name='source.options.username'
            label='Username'
            value={username}
            {...inputProps}
          />
          <StyledInput
            name='source.options.password'
            type={'password'}
            autoComplete={'off'}
            label='Password'
            value={password}
            {...inputProps}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
                />
                <StyledInput
                  name='source.options.advanced.ext_whitelist'
                  label='Extension whitelist'
                  value={ext_whitelist}
                  {...inputProps}
                />
                <StyledInput
                  name='source.options.advanced.ext_blacklist'
                  label='Extension blacklist'
                  value={ext_blacklist}
                  {...inputProps}
                />
              </Box>
            )
          }
        ]} />
    </>
  )
}
export default SourceGit