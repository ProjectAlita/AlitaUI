/* eslint-disable react/jsx-no-bind */
import { useFormik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import { Box, Typography } from '@mui/material';
import styled from "@emotion/styled";
import { StyledInput } from '@/pages/EditPrompt/Common';
import NormalRoundButton from '@/components/NormalRoundButton';
import { DEFAULT_TOKEN_EXPIRATION_DAYS, EXPIRATION_MEASURES } from '@/common/constants';
import { useTokenCreateMutation, useTokenListQuery } from '@/api/auth';
import SingleSelect from '@/components/SingleSelect';
import { capitalizeFirstChar } from '@/common/utils';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import GeneratedTokenDialog from './components/GeneratedTokenDialog';
import { useNavBlocker } from '@/pages/hooks';

const validationSchema = yup.object({
  name: yup
    .string('Enter token name')
    .required('Name is required'),
});

const Container = styled(Box)(() => (`
padding: 16px 24px 0 24px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`));

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

const CreatePersonalToken = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [openTokenDialog, setOpenTokenDialog] = useState(false)
  const [createToken, { isLoading: isGenerating }] = useTokenCreateMutation();
  const { refetch } = useTokenListQuery({ skip: true })
  const formik = useFormik({
    initialValues: {
      name: '',
      measure: EXPIRATION_MEASURES[1],
      expiration: DEFAULT_TOKEN_EXPIRATION_DAYS,
    },
    validationSchema,
    onSubmit: async () => {
      const expires = formik.values.measure === EXPIRATION_MEASURES[0]
        ?
        null
        :
        { measure: formik.values.measure, value: formik.values.expiration }
      const { error, data: tokenData } = await createToken({ name: formik.values.name, expires })
      if (!error) {
        setData(tokenData);
        setOpenTokenDialog(true);
        await refetch();
      } else {
        //
      }
    },
  });
  const hasChanged = React.useMemo(() => {
    return JSON.stringify({
      name: '',
      measure: EXPIRATION_MEASURES[1],
      expiration: DEFAULT_TOKEN_EXPIRATION_DAYS,
    }) !== JSON.stringify(formik.values);
  }, [formik.values]);

  const onCancel = useCallback(
    () => {
      navigate(-1);
    },
    [navigate],
  )

  useNavBlocker({
    blockCondition: !data.uuid && hasChanged
  });

  return (
    <Container>
      <Box sx={{ padding: '16px 24px' }}>
        <Typography variant='headingMedium'>
          New personal token
        </Typography>
        <Box sx={{ marginTop: '24px', }}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
              <Box sx={{ width: '414px', marginRight: '16px' }}>
                <StyledInput
                  variant='standard'
                  fullWidth
                  id='name'
                  name='name'
                  label='Name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Box>
              <Box sx={{ width: '200px', marginRight: '16px', paddingTop: '9px' }}>
                <SingleSelect
                  showBorder
                  id='measure'
                  name='measure'
                  label='Expiration period'
                  onChange={formik.handleChange}
                  value={formik.values.measure}
                  options={EXPIRATION_MEASURES.map((measure) => ({
                    label: capitalizeFirstChar(measure),
                    value: measure,
                  }))}
                  showOptionIcon={false}
                />
              </Box>
              <Box sx={{ width: '86px', paddingTop: '15px' }}>
                <StyledInput
                  variant='standard'
                  fullWidth
                  id='expiration'
                  name='expiration'
                  label=''
                  type="number"
                  value={formik.values.expiration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Box>
            </Box>
          </form>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '32px' }}>
          <NormalRoundButton disabled={!formik.values.name || isGenerating || !!data.uuid} onClick={() => formik.handleSubmit()}>
            Generate
            {
              isGenerating && <StyledCircleProgress size={16} />
            }
          </NormalRoundButton>
          <StyledButton onClick={onCancel}>
            Cancel
          </StyledButton>
        </Box>
      </Box>
      <GeneratedTokenDialog
        open={openTokenDialog}
        token={data?.token || ''}
        name={data?.name}
        onClose={() => { 
          setOpenTokenDialog(false); 
          onCancel();
        }}
      />
    </Container>
  );
}

export default CreatePersonalToken;