import MultipleSelect from "@/components/MultipleSelect";
import FormInput from "@/pages/DataSources/Components/Sources/FormInput";
import { useCallback, useMemo, useState } from "react";
import DatasourceSelect from "./DatasourceSelect";
import ToolFormBackButton from "./ToolFormBackButton";
import { ActionOptions, ToolTypes } from "./consts";
import { useFormikContext } from "formik";

export default function ToolDatasource({
  editToolDetail = {},
  setEditToolDetail = () => { },
  handleGoBack
}) {
  const {
    index,
    name = '',
    description = '',
    actions = [],
    datasource = '',
  } = editToolDetail;
  const { values } = useFormikContext();
  const isAdding = useMemo(() => index === (values?.tools || []).length, [index, values?.tools]);
  const [isValidating, setIsValidating] = useState(false);
  const error = useMemo(() => {
    const helperText = 'Field is required';
    return {
      name: !name?.trim() ? helperText : undefined,
      description: !description?.trim() ? helperText : undefined,
      datasource: !datasource.value ? helperText : undefined,
      actions: actions?.length < 1 ? helperText : undefined,
    }
  }, [actions?.length, datasource.value, description, name])

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
    setIsValidating(true);
    return Object.values(error).some(item => !!item)
  }, [error]);

  return (
    <>
      <ToolFormBackButton
        isAdding={isAdding}
        isDirty={isDirty}
        validate={validate}
        toolType={ToolTypes.datasource.label.toLowerCase()}
        handleGoBack={handleGoBack}
      />
      <FormInput
        required
        label='Name'
        value={name}
        onChange={handleInputChange('name')}
        error={isValidating && error.name}
        helperText={isValidating && error.name}
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
        error={isValidating && error.description}
        helperText={isValidating && error.description}
      />
      <DatasourceSelect
        required
        onValueChange={handleChange('datasource')}
        value={datasource}
        error={isValidating && error.datasource}
        helperText={isValidating && error.datasource}
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
        error={isValidating && error.actions}
        helperText={isValidating && error.actions}
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