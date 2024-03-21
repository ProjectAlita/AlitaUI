import { useGetModelsQuery } from "@/api/integrations";
import { genModelSelectValue } from "@/common/promptApiUtils";
import StyledChip from "@/components/DataDisplay/StyledChip";
import SingleGroupSelect from "@/components/SingleGroupSelect";
import { getAllIntegrationOptions } from "@/pages/DataSources/utils";
import { useSelectedProjectId } from "@/pages/hooks";
import { Box, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import FieldWithCopy from "./FieldWithCopy";


export default function IntegrationOptions() {
  const projectId = useSelectedProjectId();
  const { data: integrations } = useGetModelsQuery(projectId, { skip: !projectId });
  const onChangeModel = useCallback((integration_uid, model_name, integration_name) => {
    setModel({
      integration_uid,
      model_name,
      integration_name,
    })
  }, []);

  const [model, setModel] = useState({
    integration_uid: '',
    model_name: '',
    integration_name: '',
  });

  const modelValue = useMemo(() =>
    (model.integration_uid && model.model_name ? genModelSelectValue(model.integration_uid, model.model_name, model.integration_name) : '')
    , [model.integration_name, model.integration_uid, model.model_name]);

  const options = useMemo(() => getAllIntegrationOptions(integrations), [integrations]);

  const optionCapabilities = useMemo(() => {
    if (!model.model_name) return '';
    const groupedOptions = Object.values(options).filter(item => item.length);
    const foundGroup = groupedOptions.find((groupedOption) => groupedOption[0]?.group === model.integration_uid);
    const foundOption = foundGroup?.find(({ value: itemValue }) => itemValue === model.model_name) || {};
    return Object.entries(foundOption?.capabilities)
    .map(([key, value]) => ({ key, value}))
  }, [model.integration_uid, model.model_name, options]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }} alignItems={'flex-end'}>
          <SingleGroupSelect
            label={'Integration Options'}
            value={modelValue}
            onValueChange={onChangeModel}
            options={options}
            sx={{
              height: '54px',
              boxSizing: 'border-box',
              paddingTop: '8px',
              '& .MuiSelect-select.MuiInputBase-input.MuiInput-input': {
                marginBottom: '4px',
              },
              '& .MuiInputLabel-shrink': {
                fontSize: '16px !important',
              },
              '& .MuiSelect-icon': {
                top: 'calc(50% - 13px) !important',
                right: '12px',
              },
              '& .MuiInputLabel-root': {
                top: '5px',
              },
            }}
          />
        <Box sx={{ width: '100%' }}>
          {model.integration_uid && <FieldWithCopy
            label='Integration UID'
            value={model.integration_uid}
            boxStyles={{
              marginTop: '8px',
            }}
          />}
        </Box>
      </Box>

        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', gap: '24px' }} alignItems={'flex-start'}>
          {model.model_name && <Box sx={{
            padding: '8px 12px',
            marginTop: '8px',
            width: '100%',
          }}>
            <Typography variant='bodySmall'>Capabilities</Typography>
            <Box sx={{ padding: '8px 0'}}>
              {optionCapabilities.map((item, index) => (
                <StyledChip key={index}
                  label={item.key} isSelected={item.value} />
              ))}
            </Box>
          </Box>}
          {model.model_name && <FieldWithCopy
            label='Model name'
            value={model.model_name}
            boxStyles={{
              marginTop: '8px',
            }}
          />}
        </Box>

    </Box>
  )
}