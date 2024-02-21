import { AccordionSummary } from "@mui/material";
import { AccordionShowMode, StyledAccordion, StyledAccordionDetails, StyledExpandMoreIcon } from "./BasicAccordion";
import { filterProps } from "@/common/utils";

export const StyledAccordionSummary = styled(AccordionSummary,
  filterProps('showMode')
)(({ theme, showMode }) => ({
  display: 'flex',
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

export default function FilledAccordion({ title, showMode = AccordionShowMode.RightMode, children , defaultExpanded=true}) {
  return (<StyledAccordion
    showMode={showMode}
    defaultExpanded={defaultExpanded}
  >
    <StyledAccordionSummary
      sx={{}}
      expandIcon={<StyledExpandMoreIcon sx={{ width: '16px', height: '16px' }} />}
      aria-controls={'panel-content'}
      id={'panel-header'}
      showMode={showMode}
    >
      {title}
    </StyledAccordionSummary>
    <StyledAccordionDetails>{children}</StyledAccordionDetails>
  </StyledAccordion>
  );
}