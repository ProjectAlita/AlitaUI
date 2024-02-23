import { MuiMarkdown, getOverrides } from 'mui-markdown';
import styled from '@emotion/styled';
import { MarkdownMapping } from '@/common/constants';


const StyledDiv = styled('div')(() => `
  background: transparent;
`);

const Markdown = ({ children }) => {
  return (
    <MuiMarkdown overrides={{
      ...getOverrides(),
      ...MarkdownMapping,
      div: {
        component: StyledDiv,
        props: {},
      },
    }}>
      {children}
    </MuiMarkdown>
  )
};

export default Markdown;