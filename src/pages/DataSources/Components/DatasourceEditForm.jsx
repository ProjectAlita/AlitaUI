import React, { useCallback, useMemo } from 'react';
import { Box } from '@mui/material'
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import { useTheme } from '@emotion/react';
import SingleGroupSelect from '@/components/SingleGroupSelect';
import SingleSelect from '@/components/SingleSelect';
import { useSelectedProjectId } from '@/pages/hooks';
import { genModelSelectValue } from '@/common/promptApiUtils';
import { useTagListQuery } from '@/api/prompts';
import useModelOptions from './useModelOptions';
import { storages } from './DatasourceCreateForm';

const DatasourceEditForm = ({
  showProjectSelect = false,
  disableSelectProject = false,
  formik,
  style,
}) => {

  const theme = useTheme();
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
  const model = useMemo(() => ({
    model_name: formik.values?.embedding_model_settings?.model_name,
    integration_uid: formik.values?.embedding_model,
    integration_name: formik.values?.embedding_model_settings?.integration_name,
  }), [formik.values?.embedding_model, formik.values?.embedding_model_settings?.integration_name, formik.values?.embedding_model_settings?.model_name])

  const { embeddingModelOptions } = useModelOptions();

  const selectedModel = useMemo(() =>
    (model?.integration_uid && model?.model_name ? genModelSelectValue(model?.integration_uid, model?.model_name, model?.integration_name) : '')
    , [model?.integration_name, model?.integration_uid, model?.model_name]);


  const onChangeStorage = useCallback(
    (value) => {
      formik.setFieldValue('storage', value);
    },
    [formik]
  );

  const onChangeTags = useCallback(
    (newTags) => {
      formik.setFieldValue('version_details.tags', newTags);
    },
    [formik],
  )

  const onChangeModel = useCallback(
    (integrationUid, selModelName, integrationName) => {
      formik.setFieldValue('embedding_model', integrationUid);
      formik.setFieldValue('embedding_model_settings.model_name', selModelName);
      formik.setFieldValue('embedding_model_settings.integration_name', integrationName);
    },
    [formik]
  );

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
                  name='name'
                  label='Name'
                  required
                  value={formik.values?.name}
                  error={formik.touched?.name && Boolean(formik.errors.name)}
                  helperText={formik.touched?.name && formik.errors.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledInputEnhancer
                  autoComplete="off"
                  showexpandicon='true'
                  label='Description'
                  id='description'
                  name='description'
                  required
                  multiline
                  maxRows={15}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.description}
                  error={formik.touched?.description && Boolean(formik.errors.description)}
                  helperText={formik.touched?.description && formik.errors.description}
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
                  error={formik.touched?.embedding_model && Boolean(formik.errors.embedding_model)}
                  helperText={formik.touched?.embedding_model && formik.errors.embedding_model}
                />
                <Box sx={{ marginBottom: '8px' }}>
                  <SingleSelect
                    onValueChange={onChangeStorage}
                    label='Storage'
                    value={formik.values?.storage}
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
                    error={formik.touched?.storage && Boolean(formik.errors.storage)}
                    helperText={formik.touched?.storage && formik.errors.storage}
                  />
                </Box>
              </>
            }
            <TagEditor
              id='tags'
              label='Tags'
              tagList={tagList || []}
              stateTags={formik.values?.version_details?.tags || []}
              onChangeTags={onChangeTags}
            />
          </div>,
        },
        {
          title: 'Context',
          content: (
            <>
              <StyledInputEnhancer
                variant='standard'
                fullWidth
                name='context'
                label='Context'
                value={formik.values?.chat_context}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </>
          ),
        }
      ]} />
  );
}

export default DatasourceEditForm