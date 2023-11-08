import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export default function BasicAccordion({items = []}) {
  return (
    <div>
      {items.map(({title, content}, index) => (
        <Accordion key={index} defaultExpanded={true}
          sx={{
            '& .MuiButtonBase-root.MuiAccordionSummary-root': {
              minHeight: '2.5rem',
              padding: '0 0.75rem',
            }
          }}>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls={'panel-content' + index}
            id={'panel-header' + index}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '0.75rem 0',
              },
            }}
          >
            <Typography sx={{
              fontSize: '0.75rem', 
              textTransform: 'uppercase',
              lineHeight: '1rem',
              letterSpacing: '0.045rem'
            }}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{
            padding: '0 1rem 0 0',
            '& .MuiAccordionDetails-root': {
              padding: '0 1rem 0 0'
            }
          }}>
            {content}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}