import { useMemo, useEffect, useRef } from "react";
import SingleSelect from '@/components/SingleSelect';
import { Box } from '@mui/material';
import { OAuthTokenExchangeMethods } from '@/common/constants';
import FormInput from '@/pages/DataSources/Components/Sources/FormInput';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  client_id: yup
    .string('Enter client ID')
    .required('Client ID is required'),
  client_secret: yup
    .string('Enter client secret')
    .required('Client secret is required'),
  authorization_url: yup
    .string('Enter authorization url')
    .required('Authorization url is required'),
  token_url: yup
    .string('Enter token url')
    .required('Token url is required'),
  scope: yup
    .string('Enter scope ')
    .required('Scope is required'),
});


export default function OAuthFrom({
  onValueChange = () => { },
  value,
  sx = {},
}) {
  const refOnValueChange = useRef(onValueChange);
  const formik = useFormik({
    initialValues: value,
    validationSchema,
    onSubmit: () => { },
  });
  const tokenExchangeMethodOptions = useMemo(() => Object.values(OAuthTokenExchangeMethods), []);

  useEffect(() => {
    if (refOnValueChange.current) {
      refOnValueChange.current(formik.values)
    }
  }, [formik.values]);

  useEffect(() => {
    refOnValueChange.current = onValueChange
  }, [onValueChange])


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', ...sx }} >
      <FormInput
        required
        label='Client ID'
        id='client_id'
        name='client_id'
        value={formik.values.client_id}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.client_id && Boolean(formik.errors.client_id)}
        helperText={formik.touched.client_id && formik.errors.client_id}
      />
      <FormInput
        required
        label='Client Secret'
        id='client_secret'
        name='client_secret'
        value={formik.values.client_secret}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.client_secret && Boolean(formik.errors.client_secret)}
        helperText={formik.touched.client_secret && formik.errors.client_secret}
      />
      <FormInput
        required
        label='Authorization URL'
        id='authorization_url'
        name='authorization_url'
        value={formik.values.authorization_url}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.authorization_url && Boolean(formik.errors.authorization_url)}
        helperText={formik.touched.authorization_url && formik.errors.authorization_url}
      />
      <FormInput
        required
        label='Token URL'
        id='token_url'
        name='token_url'
        value={formik.values.token_url}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.token_url && Boolean(formik.errors.token_url)}
        helperText={formik.touched.token_url && formik.errors.token_url}
      />
      <FormInput
        required
        label='Scope'
        id='scope'
        name='scope'
        value={formik.values.scope}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.scope && Boolean(formik.errors.scope)}
        helperText={formik.touched.scope && formik.errors.scope}
      />
      <SingleSelect
        showBorder
        name='token_exchange_method'
        id='token_exchange_method'
        label='Token exchange method'
        onChange={formik.handleChange}
        value={formik.values.token_exchange_method}
        error={formik.touched.token_exchange_method && Boolean(formik.errors.token_exchange_method)}
        helperText={formik.touched.token_exchange_method && formik.errors.token_exchange_method}
        options={tokenExchangeMethodOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{ marginTop: '8px' }}
      />
    </Box>
  )
}