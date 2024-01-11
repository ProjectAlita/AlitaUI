import {
  CENTERED_CONTENT_BREAKPOINT,
  PAGE_PADDING,
  RIGHT_PANEL_HEIGHT_OFFSET,
  RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE,
} from '@/common/constants';
import { filterProps } from '@/common/utils';
import { Box, Grid } from '@mui/material';

export const FixedGrid = styled(
  Grid, 
  filterProps('offsetFromTop')
)(({offsetFromTop, theme}) => ({
  position: 'fixed',
  right: `${PAGE_PADDING}px`,
  width: RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE,
  paddingLeft: '1rem',
  marginLeft: '1rem',
  top: offsetFromTop,
  zIndex: 1000,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('centered_content')]: {
    right: `calc(50vw - ${CENTERED_CONTENT_BREAKPOINT / 2}px + ${PAGE_PADDING}px)`
  }
}));

export const ContainerBox = styled(
  Box, 
  filterProps('offsetFromTop')
)(({offsetFromTop}) => ({
  maxHeight: `calc(100vh - ${offsetFromTop})`,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  flexDirection: 'column'
}));

export default function RightPanel({ children, offsetFromTop = RIGHT_PANEL_HEIGHT_OFFSET }) {
  return (
    <FixedGrid item xs={3} offsetFromTop={offsetFromTop} >
      <ContainerBox offsetFromTop={offsetFromTop} >
        {children}
      </ContainerBox>
    </FixedGrid>
  )
}