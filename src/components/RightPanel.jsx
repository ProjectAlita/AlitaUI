import { Box, Grid } from '@mui/material';
import isPropValid from '@emotion/is-prop-valid'

export const FixedGrid = styled(Grid)(() => ({
  position: 'fixed',
  right: '1.5rem',
  width: '18.5rem',
  paddingLeft: '1rem'
}));

export const ContainerBox = styled(Box, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'offsetFromTop'}
  )(({offsetFromTop}) => ({
  height: `calc(100vh - ${offsetFromTop})`,
  overflowY: 'scroll'
}));

export default function RightPanel ({children, offsetFromTop='112px'}) {
  return (
    <FixedGrid item xs={3}>
      <ContainerBox offsetFromTop={offsetFromTop}>
        {children}
      </ContainerBox>
    </FixedGrid>
  )
}