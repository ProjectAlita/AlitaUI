import Button from '@mui/material/Button';

export default function StyledButton (props) {
  return (<Button 
    sx={{
      padding: '0.375rem 1rem',
      borderRadius: '1.75rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      textTransform: 'none',
      marginRight: '0.5rem'
    }}
    {...props}>{props.children}</Button>)
}