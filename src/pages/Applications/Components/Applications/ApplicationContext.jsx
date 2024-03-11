import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';

const ApplicationContext = ({
  instructions,
  onChangeContext,
  style,
}) => {

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Configuration',
          content: (
            <>
              <StyledInputEnhancer
                autoComplete="off"
                showexpandicon='true'
                maxRows={15}
                multiline
                variant='standard'
                fullWidth
                name='instructions'
                id='instructions'
                label='Instructions'
                value={instructions}
                onChange={onChangeContext}
              />
            </>
          ),
        }
      ]} />
  );
}

export default ApplicationContext