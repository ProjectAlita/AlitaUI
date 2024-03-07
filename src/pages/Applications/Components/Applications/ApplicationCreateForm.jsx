/* eslint-disable no-console */
import { DATA_SOURCE_PAYLOAD_KEY, SearchParams, ViewMode } from '@/common/constants';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import NormalRoundButton from '@/components/NormalRoundButton';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import TagEditor from '@/pages/Prompts/Components/Form/TagEditor';
import { useSelectedProjectId } from '@/pages/hooks';
import { useTheme } from '@emotion/react';
import { Avatar, Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApplicationCreateMutation } from '@/api/applications';
import { useTagListQuery } from '@/api/prompts';
import RouteDefinitions from '@/routes';
import { isString } from 'formik';
import { useNavigate } from 'react-router-dom';
import FileUploadControl from '@/components/FileUploadControl';


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

  const theme = useTheme();
  const [file, setFile] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])
  const projectId = useSelectedProjectId();
  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const [createRequest, { error, data, isLoading }] = useApplicationCreateMutation()
  const shouldDisableSave = useMemo(() => isLoading || !name || !description , [description, isLoading, name])


  const onCancel = useCallback(
    () => {
      navigate(-1)
    },
    [navigate],
  );

  const onClickCreate = useCallback(
    async () => {
      await createRequest({
        name, description, file,
        projectId,
        versions: [
          {
            name: 'latest',
            tags
          }
        ]
      })
    },
    [name, description, tags, createRequest, file, projectId],
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
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = useCallback((newValue) => {
    const imageUrl = newValue ? URL.createObjectURL(newValue): null;
    setImagePreview(imageUrl);
    setFile(newValue)
  }, [setFile]);
  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'General',
          content: <div>
            <Box display={'flex'} justifyContent={'space-between'} gap={'8px'}>
        {imagePreview &&
        <Box sx={{
          padding: '14px 0'
        }}>
          <Avatar sx={{ width: 50, height: 50 }}  src={imagePreview} alt="Preview" />
        </Box>}
            <FileUploadControl
            label={'Icon'}
              file={file}
              onChangeFile={handleFileChange}
              accept={'image/*'}
            />
            </Box>
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
                disabled={disableSelectProject}
                required
              />
            }
            <StyledInputEnhancer
              autoComplete="off"
              id='name'
              label='Name'
              required
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
              required
              multiline
              maxRows={15}
              onChange={onChange(DATA_SOURCE_PAYLOAD_KEY.description)}
              value={description}
              error={!!descriptionError}
              helperText={descriptionError}
            />
            <TagEditor
              id='tags'
              label='Tags'
              tagList={tagList || []}
              stateTags={tags}
              onChangeTags={onChangeTags}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
              <NormalRoundButton disabled={shouldDisableSave} variant='contained' onClick={onClickCreate} >
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