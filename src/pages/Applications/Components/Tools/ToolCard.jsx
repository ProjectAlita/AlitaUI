import ArrowRightIcon from "@/components/Icons/ArrowRightIcon";
import DatabaseIcon from "@/components/Icons/DatabaseIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import styled from "@emotion/styled";
import { Box, IconButton, Typography } from "@mui/material";
import { ToolTypes } from "./consts";

const CardContainer = styled(Box)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  backgroundColor: theme.palette.background.secondary,
  '&:hover': {
    border: '1px solid ' + theme.palette.border.lines,
    padding: '11px 15px',
  }
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
  return (
    <CardContainer>
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
        <Typography
          component='div'
          variant='labelSmall'
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {tool.description}
        </Typography>
      </Box>
      <Box>
        <IconButton
          aria-label='delete tool'
          onClick={onDelete(index)}
        >
          <DeleteIcon sx={{ fontSize: '1.13rem' }} />
        </IconButton>
      </Box>
    </CardContainer >
  )
}