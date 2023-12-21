import BigRocketIcon from "@/components/Icons/BigRocketIcon";
import { Box, Typography } from "@mui/material";

const EmptyListHintBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'headerHeight',
})(({ theme, headerHeight }) => ({
  flexFrow: 1,
  width: 'calc(100vw - 378px)',
  height: `calc(100vh - ${headerHeight})`,
  marginRight: '30px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.secondary
}))

export default function EmptyListBox({
  showErrorMessage = false,
  emptyListPlaceHolder,
  rightContent,
  headerHeight = '200px',
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
        headerHeight={headerHeight}
      >
        <Box sx={{ textAlign: 'center' }}>
          <BigRocketIcon />
          <Typography component='div' variant='labelMedium' sx={{ mt: 3 }}>
            {showErrorMessage ? (<div>Oops! Something went wrong. <br />Please try again later!</div>) : emptyListPlaceHolder}
          </Typography>
        </Box>
      </EmptyListHintBox>
      {
        rightContent &&
        <Box component='div' sx={{ mt: '-42px', width: '300px' }}>
          {rightContent}
        </Box>
      }
    </Box>
  )
}