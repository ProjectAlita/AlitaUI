import React, { useCallback } from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import TagEditor from '@/pages/Prompts/Components/Form/TagEditor';
import { useSelectedProjectId } from '@/pages/hooks';
import { useTagListQuery } from '@/api/prompts';

const DatasourceEditForm = ({
  formik,
  style,
}) => {
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
        }
      ]} />
  );
}

export default DatasourceEditForm