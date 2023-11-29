import Button from '@mui/material/Button';

const TheStyledButton = styled(Button)(({theme}) => ({
  color: theme.palette.text.secondary,
  padding: '0.375rem 1rem',
  borderRadius: '1.75rem',
  fontSize: '0.75rem',
  lineHeight: '1rem',
  textTransform: 'none',
  marginRight: '0.5rem',
}))

export default function StyledButton (props) {
  return <TheStyledButton {...props} />;
}