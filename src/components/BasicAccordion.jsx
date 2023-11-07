import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export default function BasicAccordion({items = []}) {
  return (
    <div>
      {items.map(({title, content}, index) => (
        <Accordion key={index} defaultExpanded={true}>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            aria-controls={'panel-content' + index}
            id={'panel-header' + index}
          >
            <Typography sx={{textTransform: 'uppercase'}}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}