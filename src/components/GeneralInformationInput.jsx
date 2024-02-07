import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import TagEditor from '@/pages/EditPrompt/Form/TagEditor';
import ProjectSelect, { ProjectSelectShowMode } from '@/pages/MyLibrary/ProjectSelect';
import { useTheme } from '@emotion/react';
import NormalRoundButton from '@/components/NormalRoundButton';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Button from '@/components/Button';
import EditIcon from '@/components/Icons/EditIcon';
import { useSelectedProjectName } from '@/pages/hooks';

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

export const ReadOnlyView = ({ name, description, onClickEdit, canEdit, showProjectSelect, sx }) => {
  const theme = useTheme();
  const refBody = useRef(null);
  const refContainer = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  const projectName = useSelectedProjectName();

  const scrollableAreaStyle = useMemo(() => {
    if (showReadMore && isOverflow) {
      return { marginTop: '8px', maxHeight: '70px', overflowY: 'hidden', textOverflow: 'ellipsis' };
    } else if (isOverflow) {
      return { overflowY: 'scroll', marginTop: '8px', maxHeight: '200px' };
    }
    return { marginTop: '8px', maxHeight: '70px', textOverflow: 'ellipsis' };
  }, [isOverflow, showReadMore]);

  const onClickReadMore = useCallback(() => {
    if (!showReadMore) {
      refContainer.current.scrollTop = 0;
      setTimeout(() => {
        setShowReadMore(!showReadMore);
      }, 100);
    } else {
      setShowReadMore(!showReadMore);
    }
  }, [showReadMore]);

  const updateOverflow = useCallback(() => {
    const parentRect = refContainer.current?.getBoundingClientRect();
    const childRect = refBody.current?.getBoundingClientRect();
    if (description && parentRect.height < childRect.height - 10) {
      setIsOverflow(true);
    } else {
      setIsOverflow(false);
    }
  }, [description]);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => {
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow]);

  return (
    <Box sx={{ marginTop: '4px', ...sx }}>
      { showProjectSelect &&
        <Typography variant='labelMedium' color='text.primary'>
          {`Project: ${projectName}`}
        </Typography>
      }
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='labelMedium' color='text.secondary'>
          {name}
        </Typography>
        {canEdit && <Box sx={{
          height: '26px', width: '26px', cursor: 'pointer',
          display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
        }}
          onClick={onClickEdit}>
          <EditIcon sx={{ fontSize: 16 }} fill={theme.palette.icon.fill.default} />
        </Box>}
      </Box>
      <Box ref={refContainer} sx={scrollableAreaStyle}>
        <Typography sx={{ textOverflow: 'ellipsis' }} ref={refBody} variant='bodySmall' color='text.primary'>
          {description || 'No description'}
        </Typography>
      </Box>
      {isOverflow && <Box sx={{ marginBottom: '10px' }} onClick={onClickReadMore}>
        <Typography variant='bodySmall' sx={{ color: 'text.button.showMore', cursor: 'pointer' }}>
          {showReadMore ? 'Show more' : 'Show less'}
        </Typography>
      </Box>}
    </Box>
  )
}

export const InputMode = {
  ReadOnly: 'ReadOnly',
  Create: 'Create',
  Edit: 'Edit',
}

const GeneralInformationInput = ({
  mode,
  nameError,
  nameHelperText,
  name,
  isNameRequired,
  onChangeName,
  onNameBlur,
  description,
  isDescriptionRequired,
  onChangeDescription,
  onDescriptionBlur,
  descriptionError,
  descriptionHelperText,
  tagList = [],
  stateTags = [],
  onChangeTags,
  showProjectSelect = false,
  disableSelectProject = false,
  style,
  canEdit,
  onCreate,
  canEditTagsWhenReadOnly,
}) => {
  const theme = useTheme();
  const [editable, setEditable] = useState(mode === InputMode.Create || mode === InputMode.Edit);
  const onCancel = useCallback(
    () => {
      setEditable(false);
    },
    [],
  );

  const onClickEdit = useCallback(
    () => {
      setEditable(true);
    },
    [],
  );

  const onClickCreate = useCallback(
    () => {
      setEditable(false);
      onCreate();
    },
    [onCreate],
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
              !editable ?
                <ReadOnlyView
                  name={name}
                  onClickEdit={onClickEdit}
                  description={description}
                  canEdit={canEdit}
                  showProjectSelect={showProjectSelect}
                />
                :
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
                    label={isNameRequired ? 'Name *' : 'Name'}
                    value={name}
                    error={nameError}
                    helperText={nameHelperText}
                    onChange={onChangeName}
                    onBlur={onNameBlur}
                  />
                  <StyledInputEnhancer
                    autoComplete="off"
                    showexpandicon='true'
                    id='prompt-desc'
                    label={isDescriptionRequired ? 'Description *' : 'Description'}
                    multiline
                    maxRows={15}
                    onChange={onChangeDescription}
                    value={description}
                    onBlur={onDescriptionBlur}
                    error={descriptionError}
                    helperText={descriptionHelperText}
                  />
                </>
            }
            <TagEditor
              id='tags'
              label='Tags'
              tagList={tagList}
              stateTags={stateTags}
              disabled={!editable && !canEditTagsWhenReadOnly}
              onChangeTags={onChangeTags}
            />
            {editable && <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
              <NormalRoundButton variant='contained' onClick={onClickCreate} >
                {mode === InputMode.Create ? 'Create' : 'Save'}
                {
                  false && <StyledCircleProgress size={16} />
                }
              </NormalRoundButton>
              <StyledButton onClick={onCancel}>
                Cancel
              </StyledButton>
            </Box>}
          </div>,
        }
      ]} />
  );
}

export default GeneralInformationInput