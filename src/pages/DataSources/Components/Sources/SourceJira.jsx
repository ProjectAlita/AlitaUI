/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import GroupedButton from "@/components/GroupedButton";
import SingleSelect from "@/components/SingleSelect.jsx";
import useComponentMode from "@/components/useComponentMode";

import { hostingTypes, jiraFilterTypes, tokenTypes } from "@/pages/DataSources/constants";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormikInput from "./FormikInput";
import useOptions from "./useOptions";

const hostingOptions = Object.values(hostingTypes)
const tokenTypeOptions = Object.values(tokenTypes);
const filterOptions = Object.values(jiraFilterTypes);

export const initialState = {
  url: '',
  token: '',
  api_key: '',
  hosting_option: hostingTypes.cloud.value,
  username: '',
  filter: jiraFilterTypes.project_key.value,
  filter_value: '',
  fields_to_extract: '',
  fields_to_index: '',
  include_attachments: false,
  issues_per_request: '50',
  max_total_issues: '1000',
}
const SourceJira = ({ mode }) => {
  const { setFieldValue } = useFormikContext();
  const options = useOptions({ initialState, mode });
  const {
    url = '',
    token = '',
    api_key = '',
    hosting_option = hostingTypes.cloud.value,
    username = '',
    filter = jiraFilterTypes.project_key.value,
    filter_value = '',
    fields_to_extract = '',
    fields_to_index = '',
    include_attachments = false,
    issues_per_request = '50',
    max_total_issues = '1000',
  } = options;
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);

  const [type, setType] = useState(token ? tokenTypes.token.value : tokenTypes.api_key.value);

  const handleToggle = useCallback(e => {
    const credentialType = e.target.value;
    setType(credentialType)
    if (credentialType === tokenTypes.api_key.value) {
      handleChange(tokenTypes.token.value, '');
    } else {
      handleChange(tokenTypes.api_key.value, '')
    }
  }, [handleChange]);

  const { isCreate, isView } = useComponentMode(mode);

  useEffect(() => {
    if (isCreate) {
      handleChange('filter', jiraFilterTypes.project_key.value);
    }
  }, [isCreate, handleChange]);

  return (
    <>
      <FormikInput
        required
        name='source.options.url'
        label='URL'
        value={url}
        sx={{ flexGrow: 1 }}
        disabled={!isCreate}
      />
      <Box display={"flex"} width={'100%'}>
        {
          type === tokenTypes.api_key.value ?
            <FormikInput
              required
              name='source.options.api_key'
              label='API Key'
              value={api_key}
              disabled={isView}
            /> :
            <FormikInput
              required
              name='source.options.token'
              label='Token'
              value={token}
              disabled={isView}
            />
        }
        <Box alignSelf={'end'}>
          <GroupedButton
            value={type}
            onChange={handleToggle}
            readOnly={isView}
            buttonItems={tokenTypeOptions}
          />
        </Box>
      </Box>
      <FormikInput
        required
        name='source.options.username'
        label='Username'
        value={username}
        sx={{ flexGrow: 1 }}
        disabled={isView}
      />
      <SingleSelect
        showBorder
        label='Hosting option'
        onValueChange={(value) => handleChange('hosting_option', value)}
        value={hosting_option}
        options={hostingOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{ marginTop: '8px' }}
        disabled={isView}
      />
      <Box marginTop={'8px'} paddingTop={'4px'} display={"flex"} width={'100%'} gap={'8px'}
        alignItems={'baseline'}>
        <SingleSelect
          showBorder
          label='Filter'
          onValueChange={(value) => handleChange('filter', value)}
          value={filter}
          options={filterOptions}
          customSelectedFontSize={'0.875rem'}
          sx={{ flex: '1' }}
          disabled={!isCreate}
        />
        <FormikInput
          name='source.options.filter_value'
          label={jiraFilterTypes[filter]?.label}
          value={filter_value}
          sx={{ flex: '2' }}
          disabled={!isCreate}
        />
      </Box>
      <FormikInput
        name='source.options.fields_to_extract'
        label='Fields to extract'
        value={fields_to_extract}
        sx={{ flexGrow: 1 }}
        disabled={!isCreate}
      />
      <FormikInput
        name='source.options.fields_to_index'
        label='Fields to index'
        value={fields_to_index}
        sx={{ flexGrow: 1 }}
        disabled={!isCreate}
      />
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
                  label='Include attachment'
                  checked={include_attachments || false}
                  onChange={e => handleChange('include_attachments', e.target.checked)}
                />

                <Box paddingTop={'4px'} display={"flex"} width={'100%'} gap={'8px'}>
                  <FormikInput
                    name='source.options.issues_per_request'
                    label='Issue limit per request'
                    value={issues_per_request}
                    disabled={!isCreate}
                  />
                  <FormikInput
                    name='source.options.max_total_issues'
                    label='Max total issues'
                    value={max_total_issues}
                    disabled={!isCreate}
                  />
                </Box>
              </Box>
            )
          }
        ]} />
    </>
  )
}
export default SourceJira