import { splitStringByKeyword } from '@/common/utils';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';


const HighlightText = styled('span')(({ theme }) => (`
background: ${theme.palette.background.text.highlight};
mix-blend-mode: lighten;
color: ${theme.palette.text.secondary};
`));

export default function HighlightQuery({ text }) {
  const { searchDone, query } = useSelector(state => state.search);
  return splitStringByKeyword(text, searchDone ? query : '').map((item, idx) => {
    if (item.highlight) {
      return <HighlightText key={idx}>{item.text}</HighlightText>
    } else {
      return <span key={idx}>
        {item.text}
      </span>
    }
  })
}