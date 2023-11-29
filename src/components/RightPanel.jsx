import { Box, Grid } from '@mui/material';
import isPropValid from '@emotion/is-prop-valid'

export const FixedGrid = styled(Grid)(({offsetFromTop}) => ({
  position: 'fixed',
  right: '1.5rem',
  width: '18.5rem',
  paddingLeft: '1rem',
  marginLeft: '1rem',
  top: offsetFromTop,
  zIndex: 30000
}));

export const ContainerBox = styled(Box, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'offsetFromTop'}
  )(({offsetFromTop}) => ({
    height: `calc(100vh - ${offsetFromTop})`,
    display: 'grid', 
    gridTemplateRows: 'auto 1fr',
    flexDirection: 'column'
}));

export default function RightPanel ({children, offsetFromTop='132px'}) {
  return (
    <FixedGrid item xs={3} offsetFromTop={offsetFromTop} >
      <ContainerBox offsetFromTop={offsetFromTop} >
        {children}
      </ContainerBox>
    </FixedGrid>
  )
}