import React, { useCallback } from 'react';
import { Box } from '@mui/material'
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import { useTheme } from '@emotion/react';
import { useSelectedProjectId } from '@/pages/hooks';
import { useTagListQuery } from '@/api/prompts';
import EmbeddingModelStorageView from './EmbeddingModelStorageView';

const DatasourceEditForm = ({
  showProjectSelect = false,
  disableSelectProject = false,
  formik,
  style,
}) => {

  const theme = useTheme();
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });

  const onChangeTags = useCallback(
    (newTags) => {
      formik.setFieldValue('version_details.tags', newTags);
    },
    [formik],
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
                <EmbeddingModelStorageView
                  embeddingModelName={formik.values?.embedding_model_settings?.model_name}
                  storage={formik.values?.storage}
                />
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