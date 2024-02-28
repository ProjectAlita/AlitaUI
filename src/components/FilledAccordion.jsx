import { filterProps } from "@/common/utils";
import { AccordionSummary, Box } from "@mui/material";
import { AccordionShowMode, StyledAccordion, StyledAccordionDetails, StyledExpandMoreIcon } from "./BasicAccordion";

export const StyledAccordionSummary = styled(AccordionSummary,
  filterProps('showMode')
)(({ theme, showMode }) => ({
  display: 'flex',
  flexGrow: '1',
  padding: '8px 12px',
  alignItems: 'center',
  gap: '12px',
  alignSelf: 'stretch',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.border.lines}`,
  background: theme.palette.background.button.default,
  flexDirection: showMode === AccordionShowMode.LeftMode ? 'row-reverse' : undefined,
  '& .MuiAccordionSummary-content': {
    margin: showMode === AccordionShowMode.LeftMode ? '0 0 0 12px !important' : '0 0',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

export default function FilledAccordion({
  title,
  expanded,
  onChange,
  showMode = AccordionShowMode.RightMode,
  defaultExpanded = true,
  rightContent,
  children
}) {
  return (<StyledAccordion
    showMode={showMode}
    defaultExpanded={defaultExpanded}
    expanded={expanded}
    onChange={onChange}
  >
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <StyledAccordionSummary
      sx={{}}
      expandIcon={<StyledExpandMoreIcon sx={{ width: '16px', height: '16px' }} />}
      aria-controls={'panel-content'}
      id={'panel-header'}
      showMode={showMode}
      //  To avoid summary click when clicking checkbox area but not the checkbox itself.
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(event) => event.stopPropagation()} 
    >
      {title}
    </StyledAccordionSummary>
    {rightContent}
    </Box>
    <StyledAccordionDetails>{children}</StyledAccordionDetails>
  </StyledAccordion>
  );
}