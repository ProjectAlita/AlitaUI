import { useTagListQuery } from '@/api/prompts';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import TagEditor from '@/pages/Prompts/Components/Form/TagEditor';
import { useSelectedProjectId } from '@/pages/hooks';
import { useTheme } from '@emotion/react';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';
import useCreateApplication from './useCreateApplication';
import ApplicationTools from '../Tools/ApplicationTools';
import ConversationStarters from './ConversationStarters';


const ApplicationCreateForm = ({
  showProjectSelect = true,
  disableSelectProject = false,
  style,
  setEditToolDetail,
}) => {
  const formik = useFormikContext();
  const theme = useTheme();
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
  const {
    isLoading,
  } = useCreateApplication(formik);

  const onChangeTags = useCallback(
    (newTags) => {
      formik.setFieldValue('version_details.tags', newTags);
    },
    [formik],
  );

  return (
    <>
      <BasicAccordion
        style={style}
        showMode={AccordionShowMode.LeftMode}
        items={[
          {
            title: 'General',
            content: <div style={{ paddingBottom: '24px' }}>
              {
                showProjectSelect &&
                <ProjectSelect
                  label={'Project'}
                  customSelectedColor={`${theme.palette.text.secondary} !important`}
                  showMode={ProjectSelectShowMode.NormalMode}
                  selectSX={{
                    borderBottom: `1px solid ${theme.palette.border.lines}`,
                    margin: '12px 0 8px 0 !important',
                    paddingLeft: '12px',
                  }}
                  disabled={disableSelectProject || isLoading}
                  required
                />
              }
              <StyledInputEnhancer
                autoComplete="off"
                id='name'
                label='Name'
                required
                value={formik.values?.name}
                error={formik.touched?.name && Boolean(formik.errors.name)}
                helperText={formik.touched?.name && formik.errors.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              <StyledInputEnhancer
                autoComplete="off"
                showexpandicon='true'
                id='description'
                label='Description'
                required
                multiline
                maxRows={15}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.description}
                error={formik.touched?.description && Boolean(formik.errors.description)}
                helperText={formik.touched?.description && formik.errors.description}
                disabled={isLoading}
              />
              <TagEditor
                id='tags'
                label='Tags'
                tagList={tagList || []}
                stateTags={formik.values?.version_details?.tags || []}
                disabled={isLoading}
                onChangeTags={onChangeTags}
              />
            </div>,
          }
        ]} />
      <BasicAccordion
        showMode={AccordionShowMode.LeftMode}
        items={[
          {
            title: 'Instruction',
            content: <div style={{ paddingBottom: '16px' }}>
              <StyledInputEnhancer
                autoComplete="off"
                id='instruction'
                label='Instruction'
                value={formik.values?.instruction}
                error={formik.touched?.instruction && Boolean(formik.errors.instruction)}
                helperText={formik.touched?.instruction && formik.errors.instruction}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
            </div>,
          }
        ]} />
      <ApplicationTools setEditToolDetail={setEditToolDetail} containerSX={{paddingBottom: '16px'}} />
      <ConversationStarters />
    </>
  );
}

export default ApplicationCreateForm