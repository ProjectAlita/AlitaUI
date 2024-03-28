import { useMemo, useCallback, useRef, useEffect } from "react";
import SingleSelect from '@/components/SingleSelect';
import { Box, Typography } from '@mui/material';
import { APIKeyTypes, AuthenticationTypes, AuthTypes, OAuthTokenExchangeMethods } from '@/common/constants';
import OAuthFrom from './OAuthFrom';
import APIKeyFrom from './APIKeyFrom';

const initialOAuthSetting = {
  client_id: '',
  client_secret: '',
  authorization_url: '',
  token_url: '',
  scope: '',
  token_exchange_method: OAuthTokenExchangeMethods.Default.value,
}

const initialAPIKeySetting = {
  api_key: '',
  api_key_type: APIKeyTypes.Password.value,
  auth_type: AuthTypes.Basic.value,
  custom_header: '',
}

export default function AuthenticationSelect({
  onValueChange = () => { },
  value,
  required,
  error,
  helperText,
  sx = {},
}) {
  const endRef = useRef()
  const { authentication_type, oauth_settings = initialOAuthSetting, api_key_settings = initialAPIKeySetting } = value
  const authenticationOptions = useMemo(() => Object.values(AuthenticationTypes), []);
  const onChangeAuthType = useCallback(
    (selectedAuthenticationType) => {
      onValueChange({
        ...value,
        authentication_type: selectedAuthenticationType,
      });
    },
    [onValueChange, value],
  )

  const onChangeOAuthSettings = useCallback(
    (newOAuthSettings) => {
      onValueChange({
        ...value,
        oauth_settings: newOAuthSettings,
      });
    },
    [onValueChange, value],
  )

  const onChangeAPIKeySettings = useCallback(
    (newAPIKeySettings) => {
      onValueChange({
        ...value,
        api_key_settings: newAPIKeySettings,
      });
    },
    [onValueChange, value],
  )

  useEffect(() => {
    if (authentication_type && authentication_type !== AuthenticationTypes.None.value) {
      endRef.current?.scrollIntoView();
    }
  }, [authentication_type])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', ...sx }}>
      <Box sx={{ height: '40px', padding: '0px 0px 0px 12px', gap: '10px', display: 'flex', alignItems: 'end' }}>
        <Typography sx={{ textTransform: 'uppercase' }} variant='bodyMedium' color={'default'}>
          Authentication
        </Typography>
      </Box>
      <SingleSelect
        showBorder
        name='authentication'
        label='Authentication'
        onValueChange={onChangeAuthType}
        value={authentication_type}
        options={authenticationOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{ marginTop: '8px' }}
        required={required}
        error={error}
        helperText={helperText}
      />
      {
        authentication_type === AuthenticationTypes.OAuth.value &&
        <OAuthFrom value={oauth_settings} onValueChange={onChangeOAuthSettings} />
      }
      {
        authentication_type === AuthenticationTypes.APIKey.value &&
        <APIKeyFrom value={api_key_settings} onValueChange={onChangeAPIKeySettings} />
      }
      <div ref={endRef} />
    </Box>
  )
}