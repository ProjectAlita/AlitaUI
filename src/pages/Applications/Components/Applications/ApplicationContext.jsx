import React from 'react';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import FileFields from '../Types/FileFields';
import { applicationTypes } from '@/pages/Applications/constants';
import { useFormikContext } from 'formik';

const ApplicationContext = ({
  style,
}) => {
  const {values: {version_details, type}, handleChange} = useFormikContext();

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
                name='version_details.instructions'
                id='instructions'
                label='Instructions'
                value={version_details?.instructions}
                onChange={handleChange}
              />
              { type === applicationTypes.file.value && <FileFields /> }
            </>
          ),
        }
      ]} />
  );
}

export default ApplicationContext