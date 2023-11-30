import { Fragment } from "react";
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography,
} from "@/components/BasicAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from '@mui/material/List';
import Comment from './Comment';

const StyledList = styled(List)(() => `

`);

const Comments = () => {
  return (
    <Fragment>
      <StyledAccordion>
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="comments"
          id="comments"
        >
          <StyledTypography>Comments</StyledTypography>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <StyledList>
            <Comment/>
          </StyledList>
        </StyledAccordionDetails>
      </StyledAccordion>
    </Fragment>
  );
};

export default Comments;
