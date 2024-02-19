/* eslint-disable */
import React, {useCallback, useEffect} from "react";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import SingleSelect from "@/components/SingleSelect.jsx";
import {StyledInput} from "@/pages/EditPrompt/Common.jsx";


const documentLoaders = {
  TextLoader: {
    label: 'TextLoader',
    value: 'text_loader'
  },
}

const documentLoadersOptions = Object.values(documentLoaders)

const gitTypes = {
  ssh: {
    label: 'SSH',
    value: 'ssh'
  },
  https: {
    label: 'HTTPS',
    value: 'https'
  },
}

const gitTypeOptions = Object.values(gitTypes)

const SourceGit = ({formik}) => {
  const {url, branch, type, sshKey, username, password, advanced} = formik.values.source?.options
  const {multithreading, defaultLoader, extWhitelist, extBlacklist} = advanced || {}
  const errors = formik.errors.source
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('source.options.' + field, value)
  }, [formik])
  useEffect(() => {
    handleChange('url', '')
    handleChange('branch', 'main')
    handleChange('type', gitTypes.ssh.value)
    handleChange('username', '')
    handleChange('password', '')
    handleChange('sshKey', '')
    
    handleChange('advanced.defaultLoader', documentLoaders.TextLoader.value)
    handleChange('advanced.multithreading', false)
    handleChange('advanced.extWhitelist', '')
    handleChange('advanced.extBlacklist', '')
  }, [])
  return (
    <>
      <Box display={"flex"} width={'100%'}>
        <StyledInput
          name='source.options.url'
          variant='standard'
          fullWidth
          label='URL'
          value={url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{flexGrow: 1}}
        />
        <Box alignSelf={'end'}>
          <ToggleButtonGroup
            size="small"
            value={type}
            onChange={e => handleChange('type', e.target.value)}
          >
            {gitTypeOptions.map(i => (
              <ToggleButton value={i.value} key={i.value} >{i.label}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <StyledInput
        name='source.options.branch'
        variant='standard'
        fullWidth
        label='Branch'
        value={branch}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {type === gitTypes.ssh.value &&
        <StyledInput
          name='source.options.sshKey'
          variant='standard'
          fullWidth
          label='SSH Key'
          value={sshKey}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      }
      {type === gitTypes.https.value &&
        <>
          <StyledInput
            name='source.options.username'
            variant='standard'
            fullWidth
            label='Username'
            value={username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <StyledInput
            name='source.options.password'
            type={'password'}
            autoComplete={'off'}
            variant='standard'
            fullWidth
            label='Password'
            value={password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </>
      }
      <BasicAccordion
        uppercase={false}
        style={{width: '100%'}}
        items={[
          {
            title: 'Advanced settings',
            content: (
              <Box pl={3} width={'100%'}>
                <CheckLabel
                  label='Multithreading'
                  checked={multithreading || false}
                  onChange={e => handleChange('advanced.multithreading', e.target.checked)}
                />
                <SingleSelect
                  showBorder
                  label='Default document loader'
                  onValueChange={(value) => handleChange('advanced.defaultLoader', value)}
                  value={defaultLoader}
                  options={documentLoadersOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{marginTop: '8px'}}
                />
                <StyledInput
                  name='source.options.advanced.extWhitelist'
                  variant='standard'
                  fullWidth
                  label='Extension whitelist'
                  value={extWhitelist}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledInput
                  name='source.options.advanced.extBlacklist'
                  variant='standard'
                  fullWidth
                  label='Extension blacklist'
                  value={extBlacklist}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Box>
            )
          }
        ]}/>
    </>
  )
}
export default SourceGit