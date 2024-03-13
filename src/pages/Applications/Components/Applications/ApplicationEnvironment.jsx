/* eslint-disable react/jsx-no-bind */
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import PlusIcon from '@/components/Icons/PlusIcon';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import { Box, IconButton, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

const ApplicationEnvironment = ({
  style,
}) => {
  const { values: { version_details }, handleChange, setFieldValue } = useFormikContext();
  const theme = useTheme();

  const onDelete = useCallback(index => () => {
    setFieldValue('version_details.environment', version_details?.environment?.filter((_, i) => i !== index))
  }, [setFieldValue, version_details?.environment])
  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Environment',
          content: (
            <>
              {version_details?.environment?.map(({ key, value }, index) => (
                <Box display='flex' gap='8px' alignItems='flex-end' key={index}>
                  <StyledInputEnhancer
                    autoComplete="off"
                    maxRows={15}
                    variant='standard'
                    fullWidth
                    label='Key'
                    name={`version_details.environment[${index}].key`}
                    value={key}
                    onChange={handleChange}  //splice
                    containerProps={{ display: 'flex', flex: 1 }}
                  />
                  <StyledInputEnhancer
                    autoComplete="off"
                    showexpandicon='true'
                    maxRows={15}
                    multiline
                    variant='standard'
                    fullWidth
                    label='Value'
                    name={`version_details.environment[${index}].value`}
                    value={value}
                    onChange={handleChange}
                    containerProps={{ display: 'flex', flex: 2 }}
                  />
                  <Box paddingBottom={'8px'}>
                    <IconButton
                    aria-label='delete prompt'
                    onClick={onDelete(index)}
                  >
                    <DeleteIcon sx={{ fontSize: '1rem' }} fill='white' />
                  </IconButton>
                  </Box>
                </Box>
              ))}

              <IconButton
                sx={{ background: theme.palette.background.icon.default }}
                onClick={() =>
                  setFieldValue('version_details.environment', [...version_details.environment, { key: '', value: '' }])}>
                <PlusIcon fill={theme.palette.icon.fill.secondary} />
              </IconButton>
            </>
          ),
        }
      ]} />
  );
}

export default ApplicationEnvironment