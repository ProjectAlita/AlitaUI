import { useMemo, useEffect, useRef } from "react";
import SingleSelect from '@/components/SingleSelect';
import { Box } from '@mui/material';
import { APIKeyTypes, AuthTypes } from '@/common/constants';
import FormInput from '@/pages/DataSources/Components/Sources/FormInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Toggle from '@/components/Toggle';
import { useSelectedProjectId } from '@/pages/hooks';
import { useSecretsListQuery } from '@/api/secrets';

const validationSchema = yup.object({
  api_key: yup
    .string('Enter/Select API Key')
    .required('API key is required'),
    custom_header: yup
    .string('Enter custom header')
    .required('Custom header is required'),
});


export default function APIKeyFrom({
  onValueChange = () => { },
  value,
  sx = {},
}) {
  const refOnValueChange = useRef(onValueChange);
  const customHeaderRef = useRef()
  const selectedProjectId = useSelectedProjectId();
  const { data } = useSecretsListQuery(selectedProjectId, { skip: !selectedProjectId})
  const secretsOption = useMemo(() => data?.map((item) => ({label: item.name, value: item.name}) ) || [], [data])
  const formik = useFormik({
    initialValues: value,
    validationSchema,
    onSubmit: () => { },
  });
  const authTypeOptions = useMemo(() => Object.values(AuthTypes), []);

  useEffect(() => {
    if (refOnValueChange.current) {
      refOnValueChange.current(formik.values)
    }
  }, [formik.values]);

  useEffect(() => {
    refOnValueChange.current = onValueChange
  }, [onValueChange])

  useEffect(() => {
    if (formik.values.auth_type === AuthTypes.Custom.value) {
      customHeaderRef.current?.scrollIntoView();
    }
  }, [formik.values.auth_type])
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', ...sx }} >
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        {formik.values.api_key_type === APIKeyTypes.Password.value ?
          <FormInput
            variant='standard'
            fullWidth
            id='api_key'
            name='api_key'
            required
            label='API Key'
            value={formik.values.api_key}
            type={"password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.api_key && Boolean(formik.errors.api_key)}
            helperText={formik.touched.api_key && formik.errors.api_key}
          /> :
          <SingleSelect
            required
            showBorder
            name='api_key'
            id='api_key'
            label='API Key'
            onChange={formik.handleChange}
            value={formik.values.api_key}
            error={formik.touched.api_key && Boolean(formik.errors.api_key)}
            helperText={formik.touched.api_key && formik.errors.api_key}
            options={secretsOption}
            customSelectedFontSize={'0.875rem'}
            sx={{ marginTop: '10px' }}
          />
        }
        <Toggle
          sx={{
            marginBottom: formik.touched.api_key && Boolean(formik.errors.api_key) ? '22px' : '0px'
          }}
          value={formik.values.api_key_type}
          leftValue={APIKeyTypes.Password.value}
          leftLabel={APIKeyTypes.Password.label}
          rightValue={APIKeyTypes.Secret.value}
          rightLabel={APIKeyTypes.Secret.label}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(_, toggledValue) => {
            if (value !== null) {
              formik.setFieldValue('api_key_type', toggledValue);
              formik.setFieldValue('api_key', '');
            }
          }}
        />
      </Box>
      <SingleSelect
        showBorder
        name='auth_type'
        id='auth_type'
        label='Auth type'
        onChange={formik.handleChange}
        value={formik.values.auth_type}
        error={formik.touched.auth_type && Boolean(formik.errors.auth_type)}
        helperText={formik.touched.auth_type && formik.errors.auth_type}
        options={authTypeOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{ marginTop: '10px' }}
      />
      {formik.values.auth_type === AuthTypes.Custom.value && <FormInput
        required
        label='Custom Header'
        id='custom_header'
        name='custom_header'
        value={formik.values.custom_header}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.custom_header && Boolean(formik.errors.custom_header)}
        helperText={formik.touched.custom_header && formik.errors.custom_header}
      />}
      <div ref={customHeaderRef}/>
    </Box>
  )
}