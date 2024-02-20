/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import SingleSelect from "@/components/SingleSelect.jsx";
import { gitTypes, documentLoaders } from "@/pages/DataSources/constants";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCallback, useMemo } from "react";

const documentLoadersOptions = Object.values(documentLoaders)


const gitTypeOptions = Object.values(gitTypes)

const SourceGit = ({ formik, readOnly }) => {
  const { url, branch, type, sshKey, username, password, advanced } = formik?.values?.source?.options || {}
  const { multithreading, defaultLoader, extWhitelist, extBlacklist } = advanced || {}
  const handleChange = useCallback((field, value) => {
    formik.setFieldValue('source.options.' + field, value)
  }, [formik])


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
          name='source.options.sshKey'
          label='SSH Key'
          value={sshKey}
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
                  onValueChange={(value) => handleChange('advanced.defaultLoader', value)}
                  value={defaultLoader}
                  options={documentLoadersOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{ marginTop: '8px' }}
                  disabled={readOnly}
                />
                <StyledInput
                  name='source.options.advanced.extWhitelist'
                  label='Extension whitelist'
                  value={extWhitelist}
                  {...inputProps}
                />
                <StyledInput
                  name='source.options.advanced.extBlacklist'
                  label='Extension blacklist'
                  value={extBlacklist}
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