import styled from "@emotion/styled";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

export const StyledDialogBase = styled(Dialog)(({theme}) => (`
  & .MuiDialog-paper {
    border-radius: 0.5rem;
    border: 1px solid ${theme.palette.border.lines};
    background: ${theme.palette.background.secondary};
  }
`));

export const StyledDialog = styled(StyledDialogBase)`
  & .MuiDialog-paper {
    display: flex;
    width: 28.75rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyledDialogContentText = styled(DialogContentText)(({theme}) => (`
  color: ${theme.palette.text.primary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
`));

export const StyledDialogActions = styled(DialogActions)(() => (`
  justify-content: flex-end;
  align-self: flex-end;
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
`));

export const StyledConfirmButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'danger'
})(({ theme, danger }) => (`
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.75rem;
  background: ${danger ? theme.palette.background.button.danger : theme.palette.background.button.normal};
  color: ${theme.palette.text.secondary};
  text-transform: none;
`));


export const ActionButton = styled(Button)(() => (`
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.75rem;
  text-transform: none;
`));