/* eslint-disable react/jsx-no-bind */
import { Box, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import ToolDatasource from "./ToolDatasource";
import { ToolTypes } from "./consts";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

export default function ToolForm({
  setIndexOfEditingTool,
  indexOfEditingTool = 0,
}) {
  const { values } = useFormikContext();
  const toolType = useMemo(() => (values?.tools || [])[indexOfEditingTool]?.type, [indexOfEditingTool, values?.tools])
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => setIndexOfEditingTool(-1)}
      >
        <ArrowBackOutlinedIcon sx={{ fontSize: '1rem' }} />
        <Typography variant='labelMedium' component='div' color='text.primary'>
          New datasource tool
        </Typography>
      </Box>
      <Box sx={{ padding: '12px 12px 12px 24px' }}>
        {toolType === ToolTypes.datasource.value && <ToolDatasource index={indexOfEditingTool} />}
      </Box>
    </Box>
  )
}