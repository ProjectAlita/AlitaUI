import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import PlusIcon from '@/components/Icons/PlusIcon';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import { Box, IconButton, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

const ConversationStarters = ({
  style,
}) => {
  const { values: { version_details }, handleChange, setFieldValue } = useFormikContext();
  const theme = useTheme();

  const valuesPath = 'version_details.application_settings.conversation_starters';
  const values = useMemo(() => version_details?.application_settings?.conversation_starters || [], 
    [version_details?.application_settings?.conversation_starters])
  const onAdd = useCallback(() => {
    setFieldValue(valuesPath, [
      ...values,
      '',
    ])
  }, [setFieldValue, values])

  const onDelete = useCallback(index => () => {
    setFieldValue(valuesPath, 
      values.filter((_, i) => i !== index))
  }, [setFieldValue, values])
  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Conversation starters',
          content: (
            <>
              {values.map((value, index) => (
                <Box display='flex' gap='8px' alignItems='flex-end' key={index}>
                  <StyledInputEnhancer
                    autoComplete="off"
                    showexpandicon='true'
                    maxRows={15}
                    multiline
                    variant='standard'
                    fullWidth
                    label='Value'
                    name={`${valuesPath}[${index}]`}
                    value={value}
                    onChange={handleChange}
                    containerProps={{ display: 'flex', flex: 2 }}
                  />
                  <Box paddingBottom={'8px'}>
                    <IconButton
                    aria-label='delete starter'
                    onClick={onDelete(index)}
                  >
                    <DeleteIcon sx={{ fontSize: '1rem' }} fill='white' />
                  </IconButton>
                  </Box>
                </Box>
              ))}

              <IconButton
                sx={{ background: theme.palette.background.icon.default }}
                onClick={onAdd}>
                <PlusIcon fill={theme.palette.icon.fill.secondary} />
              </IconButton>
            </>
          ),
        }
      ]} />
  );
}

export default ConversationStarters