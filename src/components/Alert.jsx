import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';



const Alert = forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default Alert;
