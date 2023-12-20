import { Box, Skeleton, Typography } from "@mui/material";
import BigRocketIcon from "@/components/Icons/BigRocketIcon";


const EmptyListHintBox = styled(Box)(({ theme }) => ({
  flexFrow: 1,
  width: 'calc(100vw - 378px)',
  height: 'calc(100vh - 200px)',
  marginRight: '30px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.secondary
}))

const PlaceholderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.button.disabled
}))

export default function EmptyListBox({
  description,
  isLoading
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
                  Let’s add prompts to create your <br />super collection!
                </Typography>
              </Box>
            </EmptyListHintBox>

            <Box component='div' sx={{ mt: '-42px', width: '300px'}}>
              <Typography component='div' variant='labelMedium' sx={{ mb: 2 }}>Description</Typography>
              {
                isLoading ?
                  <Skeleton variant='waved' height='1rem' width='100%' /> :
                  <Typography component='div' variant='bodySmall' sx={{ mb: 3 }}>{description}</Typography>
              }
              <Typography
                component='div'
                variant='labelMedium'
                sx={{ mb: 1, mr: 2 }}
              >
                Categories
              </Typography>
              <PlaceholderText variant={'labelSmall'}>No categories to display.</PlaceholderText>
            </Box>
          </Box>
  )
}