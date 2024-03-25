import MultipleSelect from "@/components/MultipleSelect";
import FormInput from "@/pages/DataSources/Components/Sources/FormInput";
import { useCallback, useState } from "react";
import DatasourceSelect from "./DatasourceSelect";
import ToolFormBackButton from "./ToolFormBackButton";
import { ActionOptions } from "./consts";

export default function ToolDatasource({
  editToolDetail = {},
  setEditToolDetail = () => { },
  handleGoBack
}) {
  const {
    name = '',
    description = '',
    actions = [],
    datasource = '',
  } = editToolDetail;

  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((field) => (value) => {
    setEditToolDetail({
      ...editToolDetail,
      [field]: value
    })
    setIsDirty(true);
  }, [editToolDetail, setEditToolDetail]);

  const handleInputChange = useCallback((field) => (event) => {
    handleChange(field)(event.target.value)
  }, [handleChange]);

  const validate = useCallback(() => {
    return name?.trim() && description?.trim() && datasource && actions?.length > 0
  }, [name, description, datasource, actions]);

  return (
    <>
      <ToolFormBackButton
        isDirty={isDirty}
        validate={validate}
        handleGoBack={handleGoBack}
      />
      <FormInput
        required
        label='Name'
        value={name}
        onChange={handleInputChange('name')}
      />
      <FormInput
        inputEnhancer
        required
        autoComplete="off"
        showexpandicon='true'
        id='tool-description'
        label='Description'
        multiline
        maxRows={15}
        value={description}
        onChange={handleInputChange('description')}
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