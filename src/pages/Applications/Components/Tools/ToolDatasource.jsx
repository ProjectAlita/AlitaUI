import MultipleSelect from "@/components/MultipleSelect";
import FormikInput from "@/pages/DataSources/Components/Sources/FormikInput";
import { useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import DatasourceSelect from "./DatasourceSelect";
import { ActionOptions } from "./consts";


export default function ToolDatasource({
  index = 0,
}) {
  const formikPath = useMemo(() => `tools[${index}].`, [index]);
  const { setFieldValue, values } = useFormikContext();
  const {
    name = '',
    description = '',
    actions = [],
    datasource = '',
  } = (values?.tools || [])[index] || {};
  const handleChange = useCallback((field) => ( value) => {
    setFieldValue(formikPath + field, value)
  }, [formikPath, setFieldValue]);

  return (
    <>
      <FormikInput
        required
        name={formikPath + 'name'}
        label='Name'
        value={name}
      />
      <FormikInput
        inputEnhancer
        required 
        autoComplete="off"
        showexpandicon='true'
        id='prompt-desc'
        label='Description'
        multiline
        maxRows={15}
        name={formikPath + 'description'}
        value={description}
      />
      <DatasourceSelect
        required
        onValueChange={handleChange('datasource')}
        value={datasource}
      />
      <MultipleSelect
        showBorder
        required
        multiple
        label='Actions'
        emptyPlaceHolder=''
        onValueChange={handleChange('actions')}
        value={actions}
        options={ActionOptions}
        customSelectedFontSize={'0.875rem'}
        sx={{
          marginTop: '8px !important',
          '& .MuiInputLabel-shrink': {
            fontSize: '16px',
            lineHeight: '21px',
            fontWeight: 400,
          },
        }}
        labelSX={{ left: '12px' }}
        selectSX={{
          paddingBottom: '8px !important',
          '& .MuiSelect-icon': {
            top: 'calc(50% - 18px);',
          },


        }}
      />
    </>
  )
}