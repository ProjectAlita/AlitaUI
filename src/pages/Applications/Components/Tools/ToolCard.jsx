import ArrowRightIcon from "@/components/Icons/ArrowRightIcon";
import DatabaseIcon from "@/components/Icons/DatabaseIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import styled from "@emotion/styled";
import { Box, IconButton, Typography } from "@mui/material";
import { ToolTypes } from "./consts";
import FileCodeIcon from '@/components/Icons/FileCodeIcon';
import { useCallback, useState } from 'react'
import { filterProps } from '@/common/utils';
import JsonIcon from '@/components/Icons/JsonIcon';

const CardContainer = styled(Box)(() => ({
  borderRadius: '8px',
}));

const CardHeaderContainer = styled(Box, filterProps('showActions'))(({ theme, showActions }) => ({
  borderRadius: showActions ? '8px 8px 0 0' : '8px',
  display: 'flex',
  padding: '12px 16px',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  backgroundColor: theme.palette.background.secondary,
  '&:hover': {
    border: '1px solid ' + theme.palette.border.lines,
    padding: '11px 15px',
  }
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  marginTop: '2px',
  borderRadius: ' 0 0 8px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  backgroundColor: theme.palette.background.secondary,
}));

const ActionRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '0 36px 0 28px',
}));

const ToolIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '8px',
  background: theme.palette.background.icon.default
}));


const ToolIcon = ({ type }) => {
  switch (type) {
    case ToolTypes.datasource.value:
      return <DatabaseIcon sx={{ fontSize: '1.13rem' }} />
    case ToolTypes.open_api.value:
      return <FileCodeIcon sx={{ fontSize: '1.13rem' }} />
    case ToolTypes.custom.value:
      return <JsonIcon sx={{ fontSize: '1.13rem' }} />
    default:
      return null
  }
};

export default function ToolCard({
  tool,
  index,
  onEdit,
  onDelete,
}) {
  const [showActions, setShowActions] = useState(false)
  const onClickShowActions = useCallback((event) => {
    event.stopPropagation();
    setShowActions(prev => !prev)
  }, [])
  return (
    <CardContainer>
      <CardHeaderContainer showActions={showActions}>
        <ToolIconContainer>
          <ToolIcon type={tool.type} />
        </ToolIconContainer>
        <Box
          onClick={onEdit(index)}
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', width: 'calc(100% - 108px)' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              variant='labelMedium'
              component='div'
              color='text.secondary'
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {tool.name}
            </Typography>
            <ArrowRightIcon sx={{ fontSize: '1rem' }} />
          </Box>
          {
            (tool.type === ToolTypes.datasource.value || tool.type === ToolTypes.custom.value) &&
            <Typography
              component='div'
              variant='labelSmall'
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {tool.description}
            </Typography>
          }
          {
            tool.type === ToolTypes.open_api.value && tool.actions &&
            <Box sx={{ cursor: 'pointer' }} onClick={onClickShowActions}>
              <Typography variant='bodySmall'>
                {showActions ? 'Hide Actions' : 'Show Actions'}
              </Typography>
            </Box>
          }
        </Box>
        <Box>
          <IconButton
            aria-label='delete tool'
            onClick={onDelete(index)}
          >
            <DeleteIcon sx={{ fontSize: '1.13rem' }} />
          </IconButton>
        </Box>
      </CardHeaderContainer>
      {
        showActions &&
        <ActionsContainer>
          {
            tool.actions.map(action => {
              return <ActionRow key={action.name}>
                <Box sx={{ width: '23px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='bodyMedium'>
                    -
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: '10px', height: '46px' }}>
                  <Typography
                    color='text.secondary'
                    sx={{ height: '24px' }}
                    variant='bodyMedium'
                    component='div'>
                    {action.name}
                  </Typography>
                  <Typography sx={{ height: '22px' }} variant='bodySmall' component='div'>
                    {action.description}
                  </Typography>
                </Box>
              </ActionRow>
            })
          }
        </ActionsContainer>
      }
    </CardContainer >
  )
}