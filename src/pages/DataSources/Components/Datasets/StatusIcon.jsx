import { datasetStatus } from "@/pages/DataSources/constants";
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useMemo } from "react";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';

const ReindexIcon = ({
  doReIndex
}) => {
  return <IconButton
    aria-label="reindex"
    onClick={doReIndex}
  >
    <RefreshOutlinedIcon color='secondary' sx={{ fontSize: '1.13rem' }} />
  </IconButton>
}

const DowloadLogsIcon = ({
  downloadLogs
}) => {
  return <IconButton
    aria-label="download-logs"
    onClick={downloadLogs}
  >
    <SimCardDownloadOutlinedIcon color='secondary' sx={{ fontSize: '1.13rem' }} />
  </IconButton>
}

export default function StatusIcon({ 
  status,
  doReIndex,
  downloadLogs,
 }) {
  const title = useMemo(() => {
    return datasetStatus[status]?.hint
  }, [status]);

  const statusIcon = useMemo(() => {
    if (status === datasetStatus.preparing.value) {
      return <CircularProgress size={16} />
    } else if (status === datasetStatus.stopped.value) {
      return <DoDisturbOnOutlinedIcon color='warning' sx={{ fontSize: '1rem' }} />
    } else if (status === datasetStatus.error.value) {
      return <ErrorOutlineOutlinedIcon color='error' sx={{ fontSize: '1rem' }} />
    }
  }, [status]);

  const actionIcons = useMemo(() => {
    if (status === datasetStatus.error.value) {
      return <>
      <DowloadLogsIcon downloadLogs={downloadLogs} />
      <ReindexIcon doReIndex={doReIndex} />
      </>
    } else if (status === datasetStatus.stopped.value) {
      return <ReindexIcon doReIndex={doReIndex} />
    }
  }, [status, downloadLogs, doReIndex]);

  return (
    <Box display='flex' alignItems={'center'}>
      <Tooltip title={title} placement='top'>
        <IconButton
          aria-label={title}
        >
          {statusIcon}
        </IconButton>
      </Tooltip>
      {actionIcons}
    </Box>
  )
}