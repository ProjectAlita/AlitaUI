import { useTagListQuery } from '@/api/prompts';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import NormalRoundButton from '@/components/NormalRoundButton';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import TagEditor from '@/pages/Prompts/Components/Form/TagEditor';
import { useSelectedProjectId } from '@/pages/hooks';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormikContext } from 'formik';
import useCreateApplication from './useCreateApplication';

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

const ApplicationCreateForm = ({
  showProjectSelect = true,
  disableSelectProject = false,
  style,
}) => {
  const navigate = useNavigate();
  const formik = useFormikContext();

  const theme = useTheme();
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
const {
    isLoading,
    create,
  } = useCreateApplication(formik);

  const shouldDisableSave = useMemo(() => isLoading || !formik.values.name || !formik.values.description,
    [formik.values.description, formik.values.name, isLoading])

  const onCancel = useCallback(
    () => {
      navigate(-1)
    },
    [navigate],
  );

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
              showProjectSelect &&
              <ProjectSelect
                label={'Project'}
                customSelectedColor={`${theme.palette.text.secondary} !important`}
                showMode={ProjectSelectShowMode.NormalMode}
                selectSX={{
                  borderBottom: `1px solid ${theme.palette.border.lines}`,
                  margin: '12px 4px 0 0 !important',
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
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
              <NormalRoundButton disabled={shouldDisableSave} variant='contained' onClick={create} >
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

export default ApplicationCreateForm