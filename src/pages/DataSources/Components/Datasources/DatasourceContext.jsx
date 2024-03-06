import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';

const DatasourceContext = ({
  context,
  onChangeContext,
  style,
}) => {

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Context',
          content: (
            <>
              <StyledInputEnhancer
                autoComplete="off"
                showexpandicon='true'
                maxRows={15}
                multiline
                variant='standard'
                fullWidth
                name='context'
                id='context'
                label='Context'
                value={context}
                onChange={onChangeContext}
              />
            </>
          ),
        }
      ]} />
  );
}

export default DatasourceContext