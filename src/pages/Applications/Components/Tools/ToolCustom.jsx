import { useCallback, useState, useMemo } from "react";
import ToolFormBackButton from "./ToolFormBackButton";
import { ToolTypes } from "./consts";
import CustomInput from './CustomInput';
import NormalRoundButton from '@/components/NormalRoundButton';

const parseSchema = (schema) => {
  let json = {};
  try {
    json = JSON.parse(schema);
  } catch (_) {
    //
  }
  return json
}

export default function ToolCustom({
  editToolDetail = {},
  setEditToolDetail = () => { },
  handleGoBack
}) {
  const {
    schema = '',
    name,
    description
  } = editToolDetail;

  const [isDirty, setIsDirty] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const error = useMemo(() => {
    const helperText = ' is required';
    return {
      name: (typeof name !== 'string' || !name?.trim()) ? 'name' + helperText : undefined,
      description: (typeof description !== 'string' || !description?.trim()) ? 'description' + helperText : undefined,
    }
  }, [description, name])

  const handleChange = useCallback((value) => {
    const json = parseSchema(value)
    setEditToolDetail({
      ...editToolDetail,
      schema: value,
      name: json.name || '',
      description: json.description || ''
    })
    setIsDirty(true);
  }, [editToolDetail, setEditToolDetail]);

  const validate = useCallback(() => {
    setIsValidating(true);
    return Object.values(error).some(item => !!item)
  }, [error]);

  const onTest = useCallback(
    () => {
      //TODO
    },
    [],
  )

  return (
    <>
      <ToolFormBackButton
        isDirty={isDirty}
        validate={validate}
        toolType={ToolTypes.custom.label.toLowerCase()}
        handleGoBack={handleGoBack}
      />
      <CustomInput
        value={schema}
        onValueChange={handleChange}
        error={isValidating && (error.name || error.description)}
        helperText={isValidating && (error.name || error.description)}
      />
      <NormalRoundButton sx={{ marginTop: isValidating && (error.name || error.description) ? '34px' : '24px' }} onClick={onTest} variant='contained' color='secondary'>
        Test
      </NormalRoundButton>
    </>
  )
}