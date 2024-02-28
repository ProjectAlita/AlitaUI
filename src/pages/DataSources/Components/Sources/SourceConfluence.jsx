/* eslint-disable react/jsx-no-bind */
import BasicAccordion from "@/components/BasicAccordion.jsx";
import CheckLabel from "@/components/CheckLabel.jsx";
import GroupedButton from "@/components/GroupedButton";
import SingleSelect from "@/components/SingleSelect.jsx";
import useComponentMode from "@/components/useComponentMode";
import {
  confluenceContentFormats,
  confluenceFilterTypes,
  hostingTypes,
  tokenTypes
} from "@/pages/DataSources/constants";
import { StyledInput } from "@/pages/EditPrompt/Common.jsx";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { useCallback, useMemo, useState } from "react";
import useOptions from "./useOptions";

const hostingOptions = Object.values(hostingTypes)
const tokenTypeOptions = Object.values(tokenTypes);
const contentFormatOptions = Object.values(confluenceContentFormats);
const filterOptions = Object.values(confluenceFilterTypes);


export const initialState = {
  url: '',
  token: '',
  api_key: '',
  hosting_option: hostingTypes.cloud.value,
  username: '',
  filter: confluenceFilterTypes.space_key.value,
  filter_value: '',
  advanced: {
    include_attachments: false,
    pages_limit_per_request: '50',
    max_total_pages: '1000',
    content_format: confluenceContentFormats.view.value,
  }
}


const SourceConfluence = ({ mode }) => {
  const { values, initialValues, setFieldValue, handleBlur, handleChange: handleFieldChange } = useFormikContext();
  const options = useOptions({ initialState: initialValues?.source?.options || initialState, setFieldValue, values, mode });
  const {
    url = '',
    token = '',
    api_key = '',
    hosting_option = hostingTypes.cloud.value,
    username = '',
    filter = confluenceFilterTypes.space_key.value,
    filter_value = '',
    advanced
  } = options;
  const { include_attachments = false,
    pages_limit_per_request = '50',
    max_total_pages = '1000',
    content_format = confluenceContentFormats.view.value,
  } = advanced || {};
  const handleChange = useCallback((field, value) => {
    setFieldValue('source.options.' + field, value)
  }, [setFieldValue]);

  const inputProps = useMemo(() => ({
    fullWidth: true,
    variant: 'standard',
    onChange: handleFieldChange,
    onBlur: handleBlur
  }), [handleBlur, handleFieldChange])

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

  return (
    <>
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
      <Box display={"flex"} width={'100%'}>
        {
          type === tokenTypes.api_key.value ?
            <StyledInput
              required
              autoComplete={'off'}
              name='source.options.api_key'
              label='API Key'
              value={api_key}
              {...inputProps}
              disabled={isView}
            /> :
            <StyledInput
              required
              autoComplete={'off'}
              name='source.options.token'
              label='Token'
              value={token}
              {...inputProps}
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
      <StyledInput
        required
        autoComplete={'off'}
        name='source.options.username'
        label='Username'
        value={username}
        sx={{ flexGrow: 1 }}
        {...inputProps}
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
        <StyledInput
          name='source.options.filter_value'
          label={confluenceFilterTypes[filter]?.label}
          value={filter_value}
          {...inputProps}
          sx={{ flex: '2' }}
          disabled={!isCreate}
        />
      </Box>
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
                  onChange={e => handleChange('advanced.include_attachments', e.target.checked)}
                />
                <SingleSelect
                  showBorder
                  label='Content format'
                  onValueChange={(value) => handleChange('advanced.content_format', value)}
                  value={content_format}
                  options={contentFormatOptions}
                  customSelectedFontSize={'0.875rem'}
                  sx={{ flex: '1' }}
                  disabled={!isCreate}
                />

                <Box paddingTop={'4px'} display={"flex"} width={'100%'} gap={'8px'}>
                  <StyledInput
                    name='source.options.advanced.pages_limit_per_request'
                    label='Pages limit per request'
                    value={pages_limit_per_request}
                    {...inputProps}
                    disabled={!isCreate}
                  />
                  <StyledInput
                    name='source.options.advanced.max_total_pages'
                    label='Max total pages'
                    value={max_total_pages}
                    {...inputProps}
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
export default SourceConfluence