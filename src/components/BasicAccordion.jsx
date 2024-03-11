import { filterProps } from '@/common/utils';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export const AccordionShowMode = {
  RightMode: 'Right',
  LeftMode: 'Left',
}

export const StyledAccordion = styled(Accordion, filterProps('showMode'))(({ showMode, theme }) => ({
  boxShadow: 'none',
  '& .MuiButtonBase-root.MuiAccordionSummary-root': {
    minHeight: '2.5rem',
    padding: showMode === AccordionShowMode.LeftMode ? '8px' : '0 0.75rem',
  },
  '::before': {
    content: 'none'
  },
  background: `${theme.palette.background.default} !important`
}));

export const StyledAccordionSummary = styled(AccordionSummary, filterProps('showMode'))(({ showMode }) => ({
  flexDirection: showMode === AccordionShowMode.LeftMode ? 'row-reverse' : undefined,
  '& .MuiAccordionSummary-content': {
    margin: showMode === AccordionShowMode.LeftMode ? '0 0 0 12px !important' : '0 0',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

export const StyledTypography = styled(Typography,
  filterProps('uppercase')
)(({ uppercase }) => ({
  fontSize: '0.75rem',
  textTransform: uppercase ? 'uppercase' : 'unset',
  lineHeight: '1rem',
  fontStyle: 'normal',
  fontWeight: 500,
  letterSpacing: '0.045rem'
}));

export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  padding: '0 0 0 36px',
  '& .MuiAccordionDetails-root': {
    padding: '0 0 0 0'
  }
}));

export const StyledExpandMoreIcon = styled(ArrowForwardIosSharpIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
}));

export default function BasicAccordion({ items = [], showMode = AccordionShowMode.LeftMode, style, uppercase = true, defaultExpanded = true }) {
  return (
    <div style={style}>
      {items.map(({ title, content }, index) => (
        <StyledAccordion
          showMode={showMode}
          key={index} defaultExpanded={defaultExpanded}
        >
          <StyledAccordionSummary
            expandIcon={<StyledExpandMoreIcon sx={{ width: '16px', height: '16px' }} />}
            aria-controls={'panel-content' + index}
            id={'panel-header' + index}
            showMode={showMode}
          >
            <StyledTypography uppercase={uppercase}>{title}</StyledTypography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>{content}</StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </div>
  );
}