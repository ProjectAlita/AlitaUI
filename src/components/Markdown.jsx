import { MuiMarkdown, getOverrides } from 'mui-markdown';
import styled from '@emotion/styled';
import Link from '@mui/material/Link';

 const MarkdownMapping = {
  h1: {
    component: 'h1',
    props: {
    },
  },
  h2: {
    component: 'h2',
    props: {
    },
  },
  h3: {
    component: 'h3',
    props: {
    },
  },
  h4: {
    component: 'h4',
    props: {
    },
  },
  h5: {
    component: 'h5',
    props: {
    },
  },
  h6: {
    component: 'h6',
    props: {
    },
  },
  p: {
    component: 'p',
    props: {
      style: { marginBlockStart: '0px' }
    },
  },
  span: {
    component: 'span',
    props: {
    },
  },
  a: {
    component: Link,
    props: {
      target: '_blank'
    },
  },
  li: {
    component: 'li',
    props: {
    },
  },
}

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