import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material'
import { useTheme } from '@emotion/react';
import EditIcon from '@/components/Icons/EditIcon';
import { useSelectedProjectName } from '@/pages/hooks';
import StyledTooltip from './Tooltip';
import useToast from './useToast';

const StyledButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '4px 8px 4px 8px',
  borderRadius: '8px',
  height: '24px',
  '&:hover': {
    background: theme.palette.background.button.default,
  },
}));

const LabelButtonWithToolTip = ({ label, value, tooltip, copyMessage }) => {
  const theme = useTheme();
  const { ToastComponent: Toast, toastInfo } = useToast();
  const onClick = useCallback(
    async () => {
      await navigator.clipboard.writeText(value);
      toastInfo(copyMessage);
    },
    [copyMessage, toastInfo, value],
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
      <Typography variant='bodySmall'>{label}</Typography>
      <StyledTooltip title={tooltip} placement="top">
        <StyledButton onClick={onClick}>
          <Typography color={theme.palette.text.secondary} variant='bodySmall'>{value}</Typography>
        </StyledButton>
      </StyledTooltip>
      <Toast />
    </Box>
  )
}

const NameDescriptionReadOnlyView = ({
  icon,
  name,
  description,
  tags,
  onClickEdit,
  canEdit,
  showProjectSelect,
  sx,
  idLabel,
  id,
  versionIdLabel,
  versionId,
}) => {
  const theme = useTheme();
  const refBody = useRef(null);
  const refContainer = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  const projectName = useSelectedProjectName();

  const scrollableAreaStyle = useMemo(() => {
    if (showReadMore && isOverflow) {
      return { marginTop: '8px', maxHeight: '70px', overflowY: 'hidden', textOverflow: 'ellipsis' };
    } else if (isOverflow) {
      return { overflowY: 'scroll', marginTop: '8px', maxHeight: '200px' };
    }
    return { marginTop: '8px', maxHeight: '70px', textOverflow: 'ellipsis' };
  }, [isOverflow, showReadMore]);

  const onClickReadMore = useCallback(() => {
    if (!showReadMore) {
      refContainer.current.scrollTop = 0;
      setTimeout(() => {
        setShowReadMore(!showReadMore);
      }, 100);
    } else {
      setShowReadMore(!showReadMore);
    }
  }, [showReadMore]);

  const updateOverflow = useCallback(() => {
    const parentRect = refContainer.current?.getBoundingClientRect();
    const childRect = refBody.current?.getBoundingClientRect();
    if (description && parentRect.height < childRect.height - 10) {
      setIsOverflow(true);
    } else {
      setIsOverflow(false);
    }
  }, [description]);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => {
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow]);

  return (
    <Box sx={{ marginTop: '4px', ...sx }}>
      {showProjectSelect &&
        <Typography variant='labelMedium' color='text.primary'>
          {`Project: ${projectName}`}
        </Typography>
      }
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
          {icon && <Avatar sx={{ width: 36, height: 36 }} src={icon} alt="Preview" />}
          <Typography variant='labelMedium' color='text.secondary'>
            {name}
          </Typography>
        </Box>
        {canEdit && <Box sx={{
          height: '26px', width: '26px', cursor: 'pointer',
          display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
        }}
          onClick={onClickEdit}>
          <EditIcon sx={{ fontSize: 16 }} fill={theme.palette.icon.fill.default} />
        </Box>}
      </Box>
      <Box ref={refContainer} sx={scrollableAreaStyle}>
        <Typography sx={{ textOverflow: 'ellipsis' }} ref={refBody} variant='bodySmall' color='text.primary'>
          {description || 'No description'}
        </Typography>
      </Box>
      {
        isOverflow &&
        <Box sx={{ marginBottom: '10px' }} onClick={onClickReadMore}>
          <Typography variant='bodySmall' sx={{ color: 'text.button.showMore', cursor: 'pointer' }}>
            {showReadMore ? 'Show more' : 'Show less'}
          </Typography>
        </Box>
      }
      {
        !!tags &&
        <Box sx={{ marginTop: isOverflow ? '0px' : '8px', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '8px' }}>
          <Typography variant='bodySmall'>Tags:</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

            {
              tags.map((tag, index) => (
                <div key={tag.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <Typography color={theme.palette.text.secondary} variant='bodySmall'>{tag.name}</Typography>
                  {
                    index !== tags.length - 1 && <Divider sx={{ background: theme.palette.border.lines, width: '1px', height: '15px' }} />
                  }
                </div>
              ))
            }
          </Box>
        </Box>
      }
      <Box sx={{ marginTop: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
        <LabelButtonWithToolTip
          label={idLabel}
          value={id}
          tooltip={'Copy ID'}
          copyMessage={'The ID has been copied to the clipboard'}
        />
        {
          versionId !== undefined && <LabelButtonWithToolTip
            label={versionIdLabel}
            value={versionId}
            tooltip={'Copy version ID'}
            copyMessage={'The version ID has been copied to the clipboard'}
          />
        }
      </Box>
    </Box>
  )
}

export default NameDescriptionReadOnlyView