import { Fragment, useRef } from 'react';
import {
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography,
} from '@/components/BasicAccordion';
import List from '@mui/material/List';
import Comment from './Comment';

const StyledList = styled(List)(
  () => `

`
);

const StyledCommentAccordionSummary = styled(StyledAccordionSummary)(
  () => `
  padding: 0 13px;
`
);

const Comments = () => {
  const targetEl = useRef(null);
  const hash = location.hash;
  if(hash === '#comments'){
    setTimeout(() => {
      targetEl.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }
  return (
    <Fragment>
      <span id='comments' ref={targetEl}></span>
      <StyledCommentAccordionSummary aria-controls='comments'>
        <StyledTypography>Comments</StyledTypography>
      </StyledCommentAccordionSummary>
      <StyledAccordionDetails>
        <StyledList>
          <Comment />
        </StyledList>
      </StyledAccordionDetails>
    </Fragment>
  );
};

export default Comments;
