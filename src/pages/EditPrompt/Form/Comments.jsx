import { Fragment } from "react";
import {
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography,
} from "@/components/BasicAccordion";
import List from '@mui/material/List';
import Comment from './Comment';

const StyledList = styled(List)(() => `

`);

const StyledCommentAccordionSummary = styled(StyledAccordionSummary)(() => (`
  padding: 0 13px;
`));

const Comments = () => {
  return (
    <Fragment>
        <StyledCommentAccordionSummary
          aria-controls="comments"
          id="comments"
        >
          <StyledTypography>Comments</StyledTypography>
        </StyledCommentAccordionSummary>
        <StyledAccordionDetails>
          <StyledList>
            <Comment/>
          </StyledList>
        </StyledAccordionDetails>
    </Fragment>
  );
};

export default Comments;
