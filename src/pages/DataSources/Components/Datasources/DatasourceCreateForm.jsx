/* eslint-disable no-console */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box } from '@mui/material'
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import { useTheme } from '@emotion/react';
import NormalRoundButton from '@/components/NormalRoundButton';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Button from '@/components/Button';
import SingleGroupSelect from '@/components/SingleGroupSelect';
import SingleSelect from '@/components/SingleSelect';
import { DATA_SOURCE_PAYLOAD_KEY, SearchParams, ViewMode } from '@/common/constants';
import { useSelectedProjectId } from '@/pages/hooks';
// eslint-disable-next-line no-unused-vars
import { useGetModelsQuery, useGetStoragesQuery } from '@/api/integrations';
import { genModelSelectValue } from '@/common/promptApiUtils';
import { useDatasourceCreateMutation } from '@/api/datasources';
import { isString } from 'formik';
import { useNavigate } from 'react-router-dom';
import RouteDefinitions from '@/routes';
import { useTagListQuery } from '@/api/prompts';
import useModelOptions from './useModelOptions';

// todo: remove mock
export const storages = [
  { value: 'Chroma', label: 'Chroma' },
  // { value: 2, label: 'PGVector' },
]

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

const DatasourceCreateForm = ({
  showProjectSelect = false,
  disableSelectProject = false,
  style,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const [storage, setStorage] = useState();
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [model, setModel] = useState({ model_name: '', integration_uid: '', integration_name: '', })

  const { embeddingModelOptions } = useModelOptions();

  const selectedModel = useMemo(() =>
    (model?.integration_uid && model?.model_name ? genModelSelectValue(model?.integration_uid, model?.model_name, model?.integration_name) : '')
    , [model?.integration_name, model?.integration_uid, model?.model_name]);

  // const { isSuccess: isQueryStoragesSuccess, data: storages } = useGetStoragesQuery(projectId, { skip: !projectId });
  // const [storageOptions, setStorageOptions] = useState([]);

  const [createRequest, { error, data, isLoading }] = useDatasourceCreateMutation()

  const onChangeStorage = useCallback(
    (value) => {
      setStorage(value);
    },
    []
  );

  // useEffect(() => {
  //   if (isQueryStoragesSuccess && storages && storages.length) {
  //     setStorageOptions(storages.map(item => ({ label: item.config.name, value: item.id, uid: item.uid })));
  //   }
  // }, [isQueryStoragesSuccess, storages]);

  const onCancel = useCallback(
    () => {
      navigate(-1)
    },
    [navigate],
  );

  const onClickCreate = useCallback(
    async () => {
      await createRequest({
        name, description, storage,
        projectId,
        embedding_model: model?.integration_uid,
        embedding_model_settings: {
          model_name: model?.model_name,
          integration_name: model?.integration_name,
        },
        versions: [
          {
            name: 'latest',
            tags
          }
        ]
      })
    },
    [
      name,
      description,
      tags,
      createRequest,
      storage,
      projectId,
      model?.model_name,
      model?.integration_uid,
      model?.integration_name],
  );

  const onChange = useCallback(
    (keyName) => (event) => {
      if (keyName === DATA_SOURCE_PAYLOAD_KEY.name) {
        setName(event.target.value);
      } else if (keyName === DATA_SOURCE_PAYLOAD_KEY.description) {
        setDescription(event.target.value);
      }
    },
    [],
  );

  const onChangeTags = useCallback(
    (newTags) => {
      setTags(newTags);
    },
    [],
  )

  const onChangeModel = useCallback(
    (integrationUid, selModelName, integrationName) => {
      setModel({
        integration_uid: integrationUid,
        integration_name: integrationName,
        model_name: selModelName,
      })
    },
    []
  );

  useEffect(() => {
    if (error) {
      // todo: handle generic errors
      isString(error.data) ?
        console.error(error) :
        error.data?.forEach(i => {
          // eslint-disable-next-line no-unused-vars
          const { ctx, loc, msg, type } = i
          switch (loc[0]) {
            case 'name':
              setNameError(msg)
              break
            case 'description':
              setDescriptionError(msg)
              break
            default:
              console.warn('Unhandled error', i)
          }
        })
    } else {
      setNameError('')
      setDescriptionError('')
    }
  }, [error])

  useEffect(() => {
    if (data) {
      const { id } = data
      const pathname = `${RouteDefinitions.MyLibrary}${RouteDefinitions.DataSources}/${id}`;
      const search = `name=${name}&${SearchParams.ViewMode}=${ViewMode.Owner}`;
      data && navigate({
        pathname,
        search,
      }, 
      { 
        replace: true,
        state: {
          routeStack: [{
            breadCrumb: name,
            viewMode: ViewMode.Owner,
            pagePath: `${pathname}?${search}`,
          }],
        },
       })
    }
  }, [data, name, navigate]);

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'General',
          content: <div>
            {
              <>
                {
                  showProjectSelect &&
                  <Box sx={{
                    width: '100%',
                    height: '56px',
                    marginBottom: '4px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end'
                  }}>
                    <ProjectSelect
                      label={'Project'}
                      customSelectedColor={`${theme.palette.text.secondary} !important`}
                      showMode={ProjectSelectShowMode.NormalMode}
                      selectSX={{
                        borderBottom: `1px solid ${theme.palette.border.lines}`,
                        margin: '0 0 !important',
                        paddingLeft: '12px'
                      }}
                      disabled={disableSelectProject}
                    />
                  </Box>
                }
                <StyledInputEnhancer
                  autoComplete="off"
                  id='name'
                  label='Name *'
                  value={name}
                  error={!!nameError}
                  helperText={nameError}
                  onChange={onChange(DATA_SOURCE_PAYLOAD_KEY.name)}
                />
                <StyledInputEnhancer
                  autoComplete="off"
                  showexpandicon='true'
                  id='prompt-desc'
                  label='Description'
                  multiline
                  maxRows={15}
                  onChange={onChange(DATA_SOURCE_PAYLOAD_KEY.description)}
                  value={description}
                  error={!!descriptionError}
                  helperText={descriptionError}
                />
                <SingleGroupSelect
                  label={'Embedding model'}
                  value={selectedModel}
                  onValueChange={onChangeModel}
                  options={embeddingModelOptions}
                  sx={{
                    height: '56px',
                    boxSizing: 'border-box',
                    paddingTop: '10px',
                    marginBottom: '8px',
                    '& .MuiSelect-icon': {
                      marginRight: '0px !important',
                    },
                    '& .MuiInputLabel-shrink': {
                      top: '12px !important',
                    },
                    '& .MuiInputLabel-root': {
                      top: '6px',
                    },
                  }}
                />
                <Box sx={{ marginBottom: '8px' }}>
                  <SingleSelect
                    onValueChange={onChangeStorage}
                    label='Storage'
                    value={storage}
                    options={storages}
                    customSelectedFontSize={'0.875rem'}
                    showBorder
                    sx={{
                      height: '56px',
                      boxSizing: 'border-box',
                      paddingTop: '10px',
                      '& .MuiInputBase-root.MuiInput-root': {
                        padding: '0 0 0 12px !important',
                      },
                      '& .MuiSelect-icon': {
                        marginRight: '0px !important',
                      },
                      '& .MuiInputLabel-shrink': {
                        top: '12px !important',
                      },
                      '& .MuiInputLabel-root': {
                        top: '6px',
                      },
                    }}
                  />
                </Box>
              </>
            }
            <TagEditor
              id='tags'
              label='Tags'
              tagList={tagList || []}
              stateTags={tags}
              onChangeTags={onChangeTags}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
              <NormalRoundButton disabled={isLoading || !name} variant='contained' onClick={onClickCreate} >
                Create
                {
                  isLoading && <StyledCircleProgress size={16} />
                }
              </NormalRoundButton>
              <StyledButton onClick={onCancel}>
                Cancel
              </StyledButton>
            </Box>
          </div>,
        }
      ]} />
  );
}

export default DatasourceCreateForm