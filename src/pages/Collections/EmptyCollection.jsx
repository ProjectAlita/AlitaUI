import { Skeleton, Typography } from "@mui/material";
import { useMemo } from 'react';
import EmptyListBox from '@/components/EmptyListBox';

const PlaceholderText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.button.disabled
}))

export default function EmptyCollection({
  description,
  isLoading
}) {
  const placeHolder = useMemo(() => <div>Let’s add prompts to create your <br />super collection!</div>, []);
  const rightContent = useMemo(() => <>
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
  </>, [description, isLoading]);
  return (
    <EmptyListBox placeHolder={placeHolder} rightContent={rightContent} />
  )
}