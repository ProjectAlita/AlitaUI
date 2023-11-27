import { Box, Grid } from '@mui/material';

export const FixedGrid = styled(Grid)(() => ({
  position: 'fixed',
  right: '1.5rem',
  width: '18.5rem',
  paddingLeft: '1rem'
}));

export const ContainerBox = styled(Box)(() => ({
  height: 'calc(100vh - 112px)',
  overflowY: 'scroll'
}));

export default function RightPanel ({children}) {
  return (
    <FixedGrid xs={3}>
      <ContainerBox>
        {children}
      </ContainerBox>
    </FixedGrid>
  )
}