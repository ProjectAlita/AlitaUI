import BigRocketIcon from "@/components/Icons/BigRocketIcon";
import { Box, Typography } from "@mui/material";


const EmptyListHintBox = styled(Box)(({ theme }) => ({
  flexFrow: 1,
  width: 'calc(100vw - 378px)',
  height: 'calc(100vh - 200px)',
  marginRight: '30px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.secondary
}))

export default function EmptyListBox({
  hint
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      component='div'
    >
      <EmptyListHintBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        component='div'
      >
        <Box sx={{ textAlign: 'center' }}>
          <BigRocketIcon />
          <Typography component='div' variant='labelMedium' sx={{ mt: 3 }}>
            {hint || 'No item to show.'}
          </Typography>
        </Box>
      </EmptyListHintBox>
    </Box>
  )
}