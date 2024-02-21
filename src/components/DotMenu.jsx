import AlertDialogV2 from "@/components/AlertDialogV2";
import DotsMenuIcon from "@/components/Icons/DotsMenuIcon";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState , useMemo, useCallback} from "react";


const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  width: '220px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 40px 8px 20px',
  '& .MuiTypography-root': {
    color: theme.palette.text.secondary
  }
}));

const BasicMenuItem = ({ icon, label, onClick }) => {
  return <StyledMenuItem onClick={onClick}>
    {icon}
    <Typography variant='labelMedium'>{label}</Typography>
  </StyledMenuItem>
};

const ActionWithDialog = ({ icon, label, confirmText, onConfirm, closeMenu }) => {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => {
    closeMenu();
    setOpen(true);
  }, [closeMenu]);
  return <>
    <BasicMenuItem icon={icon} label={label} onClick={openDialog} />
    <AlertDialogV2
      open={open}
      setOpen={setOpen}
      title='Warning'
      content={confirmText}
      onConfirm={onConfirm}
    />
  </>
};

export default function DotMenu({ id, children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const withClose = useCallback((onClickSub) =>
    () => {
      onClickSub();
      handleClose();
    }, [handleClose]);
  return (
    <Box>
      <IconButton
        id={id + '-action'}
        aria-label="more"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <DotsMenuIcon />
      </IconButton>
      <Menu
        id={id + '-dots-menu'}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
        keepMounted
      >
        {children.map((item) => {
          const commonProps = {
            key: item.label,
            label: item.label,
            icon: item.icon
          }
          return item.confirmText ?
          <ActionWithDialog
            {...commonProps}
            confirmText={item.confirmText}
            onConfirm={withClose(item.onConfirm)}
            closeMenu={handleClose}
          />: 
          <BasicMenuItem 
            {...commonProps}
            onClick={withClose(item.onClick)} 
          />
        })}
      </Menu>
    </Box>
  )
}