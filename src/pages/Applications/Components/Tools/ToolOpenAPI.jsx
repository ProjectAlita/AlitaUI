import FormInput from "@/pages/DataSources/Components/Sources/FormInput";
import { useCallback, useState, useMemo } from "react";
import AuthenticationSelect from "./AuthenticationSelect";
import ToolFormBackButton from "./ToolFormBackButton";
import { ToolTypes } from "./consts";
import OpenAPISchemaInput from './OpenAPISchemaInput';
import OpenAPIActions from './OpenAPIActions';

export default function ToolOpenAPI({
  editToolDetail = {},
  setEditToolDetail = () => { },
  handleGoBack
}) {
  const {
    name = '',
    schema = '',
    authentication = {},
    actions = [],
  } = editToolDetail;

  const [isDirty, setIsDirty] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const error = useMemo(() => {
    const helperText = 'Field is required';
    return {
      name: !name?.trim() ? helperText : undefined,
    }
  }, [name])

  const handleChange = useCallback((field) => (value) => {
    setEditToolDetail({
      ...editToolDetail,
      [field]: value
    })
    setIsDirty(true);
  }, [editToolDetail, setEditToolDetail]);

  const handleBatchChange = useCallback((value) => {
    setEditToolDetail({
      ...editToolDetail,
      ...value
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
        isDirty={isDirty}
        validate={validate}
        toolType={ToolTypes.open_api.label.toLowerCase()}
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
      <OpenAPISchemaInput
        value={schema}
        // eslint-disable-next-line react/jsx-no-bind
        onValueChange={(schemaText, schemaActions) => {
          handleBatchChange({
            schema: schemaText,
            actions: schemaActions
          })
        }} />
      <OpenAPIActions actions={actions} />
      <AuthenticationSelect
        onValueChange={handleChange('authentication')}
        value={authentication}
      />
    </>
  )
}