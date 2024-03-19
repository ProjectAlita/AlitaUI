import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import PlusIcon from '@/components/Icons/PlusIcon';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import Tooltip from '@/components/Tooltip';
import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useCallback, useMemo, useRef, useState } from 'react';

const MAX_CONVERSATION_STARTERS = 4;

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
  const disableAdd = useMemo(() => values.length >= MAX_CONVERSATION_STARTERS, [values])
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
                <Box display='flex' gap='8px' alignItems='flex-end' marginTop='8px' key={index}>
                  <StyledInputEnhancer
                    autoComplete="off"
                    variant='standard'
                    fullWidth
                    placeholder='Conversation message'
                    name={`${valuesPath}[${index}]`}
                    value={value}
                    onChange={handleChange}
                    containerProps={{ display: 'flex', flex: 2 }}
                  />
                  <Box paddingBottom={'8px'}>
                    <Tooltip placement='top' title='Delete'>
                      <IconButton
                        aria-label='delete starter'
                        onClick={onDelete(index)}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} fill='white' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}

              <Tooltip
                placement='top-start'
                title={disableAdd ? 'You have reached the limit of conversation starters' : null}
                extraStyles={{ maxWidth: 400 }}
              >
                <IconButton
                  sx={{ background: theme.palette.background.icon.default }}
                  onClick={disableAdd ? null : onAdd}>
                  <PlusIcon fill={disableAdd ? theme.palette.icon.fill.primary : theme.palette.icon.fill.secondary} />
                </IconButton>
              </Tooltip>
            </>
          ),
        }
      ]} />
  );
}


const StarterItem = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '6px',
  background: theme.palette.background.conversationStarters.default,
  '&:hover': {
    background: theme.palette.background.conversationStarters.hover,
  }
}))

const EllipsisText = styled(Typography)(() => `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`)

const EllipsisTextWithTooltip = ({ text, onClick }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const textRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    const isEllipsis = textRef.current.clientHeight < textRef.current.scrollHeight;
    setIsTooltipVisible(isEllipsis);
  }, [textRef, setIsTooltipVisible]);

  const handleMouseLeave = useCallback(() => {
    setIsTooltipVisible(false);
  }, [setIsTooltipVisible]);

  return (
    <StarterItem onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isTooltipVisible ? 
      <Tooltip placement='top' title={text} extraStyles={{ maxWidth: 500 }}>
        <EllipsisText ref={textRef} component='div' variant='bodyMedium' color='white'>
          {text}
        </EllipsisText>
      </Tooltip> :
        <EllipsisText ref={textRef} component='div' variant='bodyMedium' color='white'>
          {text}
        </EllipsisText>}
    </StarterItem>
  );
};

export function ConversationStartersView({
  items = [],
  onSend = () => { },
}) {
  const handleClick = useCallback((starter) => () => {
    onSend(starter);
  }, [onSend])
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', height: '100%' }}>
      {
        items?.length > 0 &&
        <>
          <ListItem sx={{ padding: ' 4px 0' }}>
            <Typography variant='bodyMedium'>You may start conversation from following:</Typography>
          </ListItem>
          {
            items.map((starter, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                <EllipsisTextWithTooltip text={starter} onClick={handleClick(starter)} />
              </ListItem>
            ))
          }
        </>
      }
    </Box>
  )
}

export default ConversationStarters