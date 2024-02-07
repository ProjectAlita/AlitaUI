import { Box, Checkbox, Typography, useTheme } from "@mui/material";

export default function CheckLabel ({ label, ...props }) {
  const theme = useTheme();
  return (
    <Box sx={{ padding: '4px 0' }}>
      <Checkbox
        size='small'
        name={props?.id}
        sx={{
          color: theme.palette.text.primary,
          '&.Mui-checked': {
            color: theme.palette.text.primary,
          },
        }}
        {...props}
        />
      <Typography variant='labelMedium' color={theme.palette.text.secondary}>
        {label}
      </Typography>
    </Box>
  )
}