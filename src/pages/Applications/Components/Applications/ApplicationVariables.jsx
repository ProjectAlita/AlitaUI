/* eslint-disable react/jsx-no-bind */
import BasicAccordion, { AccordionShowMode } from '@/components/BasicAccordion';
import PlusIcon from '@/components/Icons/PlusIcon';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import { Box, IconButton, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';

const ApplicationVariables = ({
  style,
}) => {
  const { values: { version_details }, handleChange, setFieldValue } = useFormikContext();
  const theme = useTheme();
  return (
    <BasicAccordion
      style={style}
      showMode={AccordionShowMode.LeftMode}
      items={[
        {
          title: 'Variables',
          content: (
            <>
              {version_details?.variables?.map(({ key, value }, index) => (
                <Box display='flex' gap='8px' key={index}>
                  <StyledInputEnhancer
                    autoComplete="off"
                    maxRows={15}
                    variant='standard'
                    fullWidth
                    label='Key'
                    name={`version_details.variables[${index}].key`}
                    value={key}
                    onChange={handleChange}  //splice
                    containerProps={{ display: 'flex', flex: 1 }}
                  />
                  <StyledInputEnhancer
                    autoComplete="off"
                    showexpandicon='true'
                    maxRows={15}
                    multiline
                    variant='standard'
                    fullWidth
                    label='Value'
                    name={`version_details.variables[${index}].value`}
                    value={value}
                    onChange={handleChange}
                    containerProps={{ display: 'flex', flex: 2 }}
                  />
                </Box>
              ))}

              <IconButton
                sx={{ background: theme.palette.background.icon.default }}
                onClick={() =>
                  setFieldValue('version_details.variables', [...version_details.variables, { key: '', value: '' }])}>
                <PlusIcon fill={theme.palette.icon.fill.secondary} />
              </IconButton>
            </>
          ),
        }
      ]} />
  );
}

export default ApplicationVariables