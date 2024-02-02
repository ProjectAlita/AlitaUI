/* eslint-disable react/jsx-no-bind */
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import styled from "@emotion/styled";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { StyledInput } from '../EditPrompt/Common';
import SecretToggle from '@/components/SecretToggle';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { SearchParams, SupportedAI } from '@/common/constants';
import { buildErrorMessage, handleDeploymentName } from '@/common/utils';
import IconButton from '@/components/IconButton';
import PlusIcon from '@/components/Icons/PlusIcon';
import CommonIconButton from './components/CommonIconButton';
import NormalRoundButton from '@/components/NormalRoundButton';
import ImportIcon from '@/components/Icons/ImportIcon';
import { useTheme } from '@emotion/react';
import ModelsTable from './components/ModelsTable';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@/components/Tooltip';
import AddModelForm from './components/AddModelForm';
import ClearModelsButton from './components/ClearModelsButton';
import {
  useCreateAIDeploymentMutation,
  useGetDeploymentDetailQuery,
  useLazyGetModelsQuery,
  useLoadModelsMutation,
  useTestConnectionMutation,
  useUpdateDeploymentMutation
} from '@/api/integrations';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import { useNavBlocker, useProjectId } from '../hooks';
import Toast from '../../components/Toast';


const Container = styled(Box)(({ theme }) => (`
border-top: 1px solid ${theme.palette.secondary.main};
padding: 16px 24px 0 24px;
display: flex;
flex-direction: row;
justify-content: flex-start;
`));

const BottomContainer = styled(Box)(() => (`
margin-top: 16px;
padding: 16px 24px 0 24px;
display: flex;
flex-direction: column;
justify-content: flex-start;
`));

const getValidateSchema = (deploymentName) => {
  switch (deploymentName) {
    case SupportedAI.AIDial:
      return yup.object({
        name: yup
          .string('Enter deployment name')
          .required('Name is required'),
        api_base: yup
          .string('Enter API base')
          .required('API base is required'),
        api_version: yup
          .string('Enter API version')
          .required('API version is required'),
        secret: yup
          .string('Enter API key')
          .required('API key is required'),
      });
    case SupportedAI.OpenAI:
      return yup.object({
        name: yup
          .string('Enter deployment name')
          .required('Name is required'),
        secret: yup
          .string('Enter API key')
          .required('API key is required'),
      });
    case SupportedAI.VertexAI:
      return yup.object({
        name: yup
          .string('Enter deployment name')
          .required('Name is required'),
        api_base: yup
          .string('Enter zone')
          .required('Zone is required'),
        api_version: yup
          .string('Enter project')
          .required('Project is required'),
        secret: yup
          .string('Enter API key')
          .required('API key is required'),
      });
    default:
      return yup.object({});
  }
}

const initialDeployment = {
  name: '',
  api_base: '',
  api_version: '',
  secret: '',
  from_secrets: false,
  is_default: false,
  is_shared: false,
  models: [],
}

const getBody = (deploymentName, formik, projectId, secretHasChanged) =>
  deploymentName === SupportedAI.AIDial
    ?
    ({
      api_token: {
        value: formik.values.secret,
        from_secrets: secretHasChanged ? false : formik.values.from_secrets,
      },
      api_base: formik.values.api_base,
      api_version: formik.values.api_version,
      models: formik.values.models,
      project_id: projectId,
      config: {
        name: formik.values.name,
        is_shared: formik.values.is_shared,
      },
      is_default: formik.values.is_default,
      status: "success",
      mode: "default"
    })
    :
    deploymentName === SupportedAI.OpenAI
      ?
      ({
        api_token: {
          value: formik.values.secret,
          from_secrets: secretHasChanged ? false : formik.values.from_secrets,
        },
        models: formik.values.models,
        project_id: projectId,
        config: {
          name: formik.values.name,
          is_shared: formik.values.is_shared,
        },
        is_default: formik.values.is_default,
        status: "success",
        mode: "default"
      })
      :
      deploymentName === SupportedAI.VertexAI
        ?
        ({
          zone: formik.values.api_base,
          project: formik.values.api_version,
          service_account_info: {
            value: formik.values.secret,
            from_secrets: secretHasChanged ? false : formik.values.from_secrets,
          },
          models: formik.values.models,
          project_id: projectId,
          config: {
            name: formik.values.name,
            is_shared: formik.values.is_shared,
          },
          is_default: formik.values.is_default,
          status: "success",
          mode: "default"
        })
        :
        {};

const mapDeploymentToValues = (deployment, isVertexAI) => ({
  name: deployment.config?.name || '',
  is_shared: deployment.config?.is_shared || false,
  api_base: (!isVertexAI ? deployment.settings?.api_base : deployment.settings?.zone) || '',
  api_version: (!isVertexAI ? deployment.settings?.api_version : deployment.settings?.project) || '',
  secret: (!isVertexAI ? deployment.settings?.api_token?.value : deployment.settings?.service_account_info?.value) || '',
  from_secrets: (!isVertexAI ? deployment.settings?.api_token?.from_secrets : deployment.settings?.service_account_info?.from_secrets) || false,
  is_default: deployment.is_default,
  models: deployment.settings?.models || [],
})

const CreateDeployment = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const { uid } = useParams();
  const projectId = useProjectId();
  const firstLoad = useRef(true);
  const hasSubmitted = useRef(false);
  const [createAIDeployment, { isLoading: isCreating }] = useCreateAIDeploymentMutation();
  const [updateAIDeployment, { isLoading: isUpdating }] = useUpdateDeploymentMutation();
  const [loadModels, { isLoading: isLoadingModels }] = useLoadModelsMutation();
  const [testConnection, { isLoading: isTesting }] = useTestConnectionMutation();
  const { data: deployment, isLoading } = useGetDeploymentDetailQuery({ projectId, uid }, { skip: !uid || !projectId, refetchOnMountOrArgChange: true });
  const deploymentName = useMemo(() => searchParams.get(SearchParams.DeploymentName), [searchParams]);
  const isVertexAI = useMemo(() => deploymentName === SupportedAI.VertexAI, [deploymentName]);
  const [showAddModelUI, setShowAddModelUI] = useState(false);
  const [showPlainText, setShowPlainText] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [getModels] = useLazyGetModelsQuery();
  const initialValues = useMemo(() => {
    if (!uid || !deployment) {
      return { ...initialDeployment }
    } else {
      return mapDeploymentToValues(deployment, isVertexAI)
    }
  }, [deployment, isVertexAI, uid]);

  const formik = useFormik({
    initialValues,
    validationSchema: getValidateSchema(deploymentName),
    onSubmit: async () => {
      if (!hasSubmitted.current) {
        let resultError = undefined;
        const secretHasChanged = initialValues.secret !== formik.values.secret
        if (!deployment?.id) {
          const { error } = await createAIDeployment(
            {
              aiType: deploymentName,
              body: getBody(deploymentName, formik, projectId, secretHasChanged)
            }
          )
          resultError = error
        } else {
          const { error } = await updateAIDeployment(
            {
              id: deployment?.id,
              projectId,
              body: getBody(deploymentName, formik, projectId, secretHasChanged)
            }
          )
          resultError = error
        }
        if (!resultError) {
          getModels(projectId);
          hasSubmitted.current = true;
          setTimeout(() => {
            navigate(-1);
          }, 0);
        } else {
          setToastMessage(buildErrorMessage(resultError));
          setToastSeverity('error');
          setOpenToast(true);
        }
      }
    },
  });

  useEffect(() => {
    if (uid && firstLoad.current && deployment) {
      setTimeout(() => {
        formik.setValues(
          mapDeploymentToValues(deployment, isVertexAI)
        )
      }, 0);
      firstLoad.current = false
    }
  }, [
    isVertexAI,
    uid,
    deployment,
    formik,
    initialValues.name])

  const hasChange = React.useMemo(() => {
    return JSON.stringify(initialValues) !== JSON.stringify(formik.values);
  }, [formik.values, initialValues]);

  const shouldDisableSave = useMemo(() => {
    if (deploymentName === SupportedAI.OpenAI) {
      return !formik.values.name ||
        !formik.values.secret ||
        !formik.values.models.length ||
        !hasChange ||
        isCreating ||
        isUpdating;
    } else if (deploymentName === SupportedAI.AIDial) {
      return !formik.values.name ||
        !formik.values.api_base ||
        !formik.values.api_version ||
        !formik.values.secret ||
        !formik.values.models.length ||
        !hasChange ||
        isCreating ||
        isUpdating;
    } else if (deploymentName === SupportedAI.VertexAI) {
      return !formik.values.name ||
        !formik.values.api_base ||
        !formik.values.api_version ||
        !formik.values.secret ||
        !formik.values.models.length ||
        !hasChange ||
        isCreating ||
        isUpdating;
    }
    return true;
  }, [deploymentName,
    formik.values.api_base,
    formik.values.api_version,
    formik.values.models.length,
    formik.values.name,
    formik.values.secret,
    hasChange,
    isCreating,
    isUpdating]);

  useNavBlocker({
    blockCondition: hasChange && !hasSubmitted.current
  });

  const onShowAddModelUI = useCallback(
    () => {
      setShowAddModelUI(true);
    },
    [],
  )

  const onAddModel = useCallback(
    (model) => {
      if (!formik.values.models.find(item => item.id === model.id)) {
        setShowAddModelUI(false);
        setTimeout(() => {
          formik.setFieldValue('models', [...formik.values.models, model]);
        }, 0);
      } else {
        setToastMessage(`The model ${model.id} has already been added!`);
        setToastSeverity('error');
        setOpenToast(true);
        return;
      }
    },
    [formik],
  )

  const onCancelAddModel = useCallback(
    () => {
      setShowAddModelUI(false);
    },
    [],
  )

  const onDownloadModels = useCallback(
    async () => {
      const secretHasChanged = initialValues.secret !== formik.values.secret
      const { data = [], error } = await loadModels({
        aiType: deploymentName,
        projectId,
        body: getBody(deploymentName, formik, projectId, secretHasChanged),
      })
      if (!error) {
        const downloadedModels = data.map(model => ({
          ...model,
          name: model.name || model.id,
        }));
        setTimeout(() => {
          const models = [...formik.values.models];
          downloadedModels.forEach(model => {
            if (!formik.values.models.find(item => item.id === model.id)) {
              models.push(model)
            }
          })
          formik.setFieldValue('models', models);
        }, 0);
      } else {
        setToastMessage(buildErrorMessage(error));
        setToastSeverity('error');
        setOpenToast(true);
      }
    },
    [deploymentName, formik, initialValues.secret, loadModels, projectId],
  )

  const onChangeOneModel = useCallback(
    (newModel) => {
      setTimeout(() => {
        const models = [...formik.values.models];
        const foundModelIndex = models.findIndex(model => model.id === newModel.id);
        models[foundModelIndex] = newModel
        formik.setFieldValue('models', models);
      }, 0);
    },
    [formik],
  )

  const onDeleteOneModel = useCallback(
    (modelId) => {
      setTimeout(() => {
        const models = [...formik.values.models];
        formik.setFieldValue('models', models.filter(model => model.id !== modelId));
      }, 0);
    },
    [formik],
  )

  const onClearModels = useCallback(
    () => {
      setTimeout(() => {
        formik.setFieldValue('models', []);
      }, 0);
    },
    [formik],
  )

  const onCancel = useCallback(
    () => {
      navigate(-1);
    },
    [navigate],
  );

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
  }, []);

  const onTestConnection = useCallback(
    async () => {
      const secretHasChanged = initialValues.secret !== formik.values.secret
      const { error } = await testConnection({
        aiType: deploymentName,
        body: getBody(deploymentName, formik, projectId, secretHasChanged),
      })

      if (!error) {
        setToastSeverity('success');
        setOpenToast(true);
        setToastMessage('The collection is OK!');
      } else {
        setToastSeverity('error');
        setToastMessage(buildErrorMessage(error));
        setOpenToast(true);
      }
    },
    [deploymentName, formik, initialValues.secret, projectId, testConnection],
  )

  return (
    <>
      <Box sx={{ marginBottom: '20px', paddingLeft: '24px' }}>
        <Typography variant='headingSmall'>
          {handleDeploymentName(deploymentName)}
        </Typography>
      </Box>
      <Box sx={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        'msOverflowStyle': 'none',
        '::-webkit-scrollbar': {
          width: '0 !important',
          height: '0',
        }
      }}>
        {
          !isLoading
            ?
            <form onSubmit={formik.handleSubmit}>
              <Container sx={{ flexWrap: 'wrap', gap: '16px 32px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50vw - 48px)', height: '56px' }}>
                  <Box sx={{ width: '100%' }}>
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
                </Box>
                {deploymentName !== SupportedAI.OpenAI &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50vw - 48px)', height: '56px' }}>
                    <Box sx={{ width: '100%' }}>
                      <StyledInput
                        variant='standard'
                        fullWidth
                        id='api_base'
                        name='api_base'
                        label={!isVertexAI ? 'API Base' : 'Zone'}
                        value={formik.values.api_base}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.api_base && Boolean(formik.errors.api_base)}
                        helperText={formik.touched.api_base && formik.errors.api_base}
                      />
                    </Box>
                  </Box>}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50vw - 48px)', height: '56px' }}>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <StyledInput
                      variant='standard'
                      fullWidth
                      id='secret'
                      name='secret'
                      label={!isVertexAI ? 'Secret API Key' : 'Service account'}
                      value={formik.values.secret}
                      type={showPlainText ? undefined : "password"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.secret && Boolean(formik.errors.secret)}
                      helperText={formik.touched.secret && formik.errors.secret}
                    />
                    <SecretToggle
                      showPlainText={showPlainText}
                      onChange={(_, value) => {
                        if (value !== null) {
                          setShowPlainText(value)
                        }
                      }}
                    />
                  </Box>
                </Box>
                {deploymentName !== SupportedAI.OpenAI &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: 'calc(50vw - 48px)', height: '56px' }}>
                    <Box sx={{ width: '100%' }}>
                      <StyledInput
                        variant='standard'
                        fullWidth
                        id='api_version'
                        name='api_version'
                        label={!isVertexAI ? 'API Version' : 'Project'}
                        value={formik.values.api_version}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.api_version && Boolean(formik.errors.api_version)}
                        helperText={formik.touched.api_version && formik.errors.api_version}
                      />
                    </Box>
                  </Box>}
              </Container>
              <BottomContainer>
                <Box
                  sx={{
                    padding: '12px',
                    marginBottom: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Typography variant='subtitle'>
                    Models
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                    <Tooltip title='Download models' placement="top">
                      <CommonIconButton disabled={isLoadingModels} onClick={onDownloadModels}>
                        <ImportIcon sx={{ width: '16px', height: '16px' }} fill={!isLoadingModels ? theme.palette.icon.fill.send : theme.palette.icon.fill.default} />
                        {isLoadingModels && <StyledCircleProgress size={20} />}
                      </CommonIconButton>
                    </Tooltip>
                    <ClearModelsButton disabled={!formik.values.models.length} onClear={onClearModels} />
                    <Tooltip title='Add model' placement="top">
                      <IconButton onClick={onShowAddModelUI}>
                        <PlusIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {
                  showAddModelUI && <AddModelForm onAddModel={onAddModel} onCancel={onCancelAddModel} isVertexAI={isVertexAI} />
                }
                <ModelsTable
                  models={formik.values.models}
                  onChangeOneModel={onChangeOneModel}
                  onDeleteOneModel={onDeleteOneModel}
                  isVertexAI={isVertexAI}
                />
                <Box sx={{ display: 'flex', marginTop: '32px', flexDirection: 'row', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        id={'is_default'}
                        name={'is_default'}
                        onChange={formik.handleChange}
                        sx={{
                          color: theme.palette.text.primary,
                          '&.Mui-checked': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        checked={formik.values.is_default} />
                    }
                    label={
                      <Typography variant='bodyMedium'>
                        Set as default
                      </Typography>
                    }
                  />
                  <NormalRoundButton onClick={onTestConnection} variant='contained' color='secondary'>
                    Test connection
                    {isTesting && <StyledCircleProgress size={20} />}
                  </NormalRoundButton>
                </Box>
                <Box sx={{ display: 'flex', marginTop: '32px', flexDirection: 'row', alignItems: 'center' }}>
                  <NormalRoundButton
                    onClick={() => formik.handleSubmit()}
                    variant='contained'
                    disabled={shouldDisableSave || hasSubmitted.current}
                  >
                    Save
                    {(isCreating || isUpdating) && <StyledCircleProgress size={20} />}
                  </NormalRoundButton>
                  <NormalRoundButton onClick={onCancel} variant='contained' color='secondary'>
                    Cancel
                  </NormalRoundButton>
                </Box>
              </BottomContainer>
            </form>
            :
            <Box marginLeft={'20px'}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ width: '49%' }}>
                  <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={60} />
                  <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={60} />
                </Box>
                <Box sx={{ width: '49%' }} >
                  <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={60} />
                  <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={60} />
                </Box>
              </Box>
              <Skeleton sx={{ marginTop: '16px', marginBottom: '16px' }} variant="rectangular" width={'100%'} height={40} />
              <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={40} />
              <Skeleton sx={{ marginBottom: '16px' }} variant="rectangular" width={'100%'} height={40} />
            </Box>
        }
      </Box>
      <Toast
        open={openToast}
        severity={toastSeverity}
        message={toastMessage}
        onClose={onCloseToast}
      />
    </>
  );
}

export default CreateDeployment;