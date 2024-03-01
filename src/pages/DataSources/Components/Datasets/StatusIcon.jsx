import { datasetStatus } from "@/pages/DataSources/constants";
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useMemo } from "react";


export default function StatusIcon({ status }) {
  const title = useMemo(() => {
    return datasetStatus[status]?.hint
  }, [status]);

  const icon = useMemo(() => {
    if (status === datasetStatus.preparing.value) {
      return <CircularProgress size={16} />
    } else if (status === datasetStatus.stopped.value) {
      return <DoDisturbOnOutlinedIcon color='warning' sx={{ fontSize: '1rem' }} />
    } else if (status === datasetStatus.error.value) {
      return <ErrorOutlineOutlinedIcon color='error' sx={{ fontSize: '1rem' }} />
    }
  }, [status]);
  return (
    <Box display='flex' alignItems={'center'}>
      <Tooltip title={title} placement='top'>
        <IconButton
          aria-label={title}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Box>
  )
}