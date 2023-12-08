import { Box, Grid } from '@mui/material';
import { filterProps } from '@/common/utils';
import { RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE } from '@/common/constants';

export const FixedGrid = styled(
  Grid, 
  filterProps('offsetFromTop')
)(({offsetFromTop}) => ({
  position: 'fixed',
  right: '1.5rem',
  width: RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE,
  paddingLeft: '1rem',
  marginLeft: '1rem',
  top: offsetFromTop,
  zIndex: 1000
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

export default function RightPanel({ children, offsetFromTop = '127px' }) {
  return (
    <FixedGrid item xs={3} offsetFromTop={offsetFromTop} >
      <ContainerBox offsetFromTop={offsetFromTop} >
        {children}
      </ContainerBox>
    </FixedGrid>
  )
}