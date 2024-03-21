import { datasetStatus } from "@/pages/DataSources/constants";
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import { useTheme } from '@emotion/react';

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
  error = 'An error',
  doReIndex,
  downloadLogs,
}) {
  const theme = useTheme();
  const title = useMemo(() => {
    return (status === datasetStatus.error.value ? error : '') + datasetStatus[status]?.hint
  }, [error, status]);

  const statusIcon = useMemo(() => {
    if ([datasetStatus.preparing.value, datasetStatus.pending.value, datasetStatus.running.value].includes(status)) {
      return <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          color: theme.palette.text.info
        }}>
        <CircularProgress color={'inherit'} size={16} />
        <Typography color={'inherit'} variant='labelSmall'>Files extracting...</Typography>
      </Box>
    } else if (status === datasetStatus.stopped.value) {
      return <DoDisturbOnOutlinedIcon color='warning' sx={{ fontSize: '1rem' }} />
    } else if (status === datasetStatus.error.value) {
      return <ErrorOutlineOutlinedIcon color='error' sx={{ fontSize: '1rem' }} />
    }
  }, [status, theme.palette.text.info]);

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
      {!!statusIcon && <Tooltip title={title} placement='top'>
        <IconButton
          aria-label={title}
        >
          {statusIcon}
        </IconButton>
      </Tooltip>}
      {actionIcons}
    </Box>
  )
}