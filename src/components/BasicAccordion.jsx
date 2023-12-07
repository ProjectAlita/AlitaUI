import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export const StyledAccordion = styled(Accordion)(() => ({
  boxShadow: 'none',
  '& .MuiButtonBase-root.MuiAccordionSummary-root': {
    minHeight: '2.5rem',
    padding: '0 0.75rem',
  }
}));

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  '& .MuiAccordionSummary-content': {
    margin: '0.75rem 0',
  },
}));

export const StyledTypography = styled(Typography)(() => ({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  lineHeight: '1rem',
  fontStyle: 'normal',
  fontWeight: 500,
  letterSpacing: '0.045rem'
}));

export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  padding: '0 1rem 0 0',
  '& .MuiAccordionDetails-root': {
    padding: '0 1rem 0 0'
  }
}));

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({theme}) => ({
  color: theme.palette.icon.fill.default,
}));

export default function BasicAccordion({ items = [] }) {
  return (
    <div>
      {items.map(({ title, content }, index) => (
        <StyledAccordion key={index} defaultExpanded={true}
        >
          <StyledAccordionSummary
            expandIcon={<StyledExpandMoreIcon />}
            aria-controls={'panel-content' + index}
            id={'panel-header' + index}
          >
            <StyledTypography>{title}</StyledTypography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>{content}</StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </div>
  );
}