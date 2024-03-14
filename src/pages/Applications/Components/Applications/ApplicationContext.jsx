import { contextResolver } from '@/common/utils';
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import FileReaderEnhancer from '@/pages/Prompts/Components/Form/FileReaderInput';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

const ApplicationContext = ({
  style,
}) => {
  const { values: { version_details }, setFieldValue } = useFormikContext();
  const handleChange = useCallback((value) =>
    setFieldValue('version_details.instructions', value),
    [setFieldValue]);

  const updateVariableList = useCallback((value) => {
    const resolvedInputValue = contextResolver(value);
    setFieldValue('version_details.variables', resolvedInputValue.map(key => {
      const prevValue = (version_details?.variables || []).find(v => v.key === key)
      return {
        key: key,
        value: prevValue?.value || '',
        id: prevValue?.id || undefined,
      }
    }))
  }, [setFieldValue, version_details?.variables]);

  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Configuration',
          content: (
            <>
              <FileReaderEnhancer
                showexpandicon='true'
                id="application-instructions"
                placeholder='Input the instructions here'
                defaultValue={version_details?.instructions}
                onChange={handleChange}
                updateVariableList={updateVariableList}
                label='Instructions'
                multiline
              />
            </>
          ),
        }
      ]} />
  );
}

export default ApplicationContext