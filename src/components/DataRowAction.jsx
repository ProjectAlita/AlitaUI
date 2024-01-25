import { useDeletePromptMutation } from '@/api/prompts';
import { CollectionStatus, ContentType, ViewMode } from "@/common/constants";
import useCollectionActions from "@/pages/Collections/useCollectionActions";
import AddToCollectionDialog from "@/pages/EditPrompt/AddToCollectionDialog";
import { useExport } from "@/pages/EditPrompt/ExportDropdownMenu";
import { useProjectId } from "@/pages/hooks";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import AlertDialogV2 from "./AlertDialogV2";
import BookmarkIcon from "./Icons/BookmarkIcon";
import DeleteIcon from "./Icons/DeleteIcon";
import DotsMenuIcon from "./Icons/DotsMenuIcon";
import EditIcon from "./Icons/EditIcon";
import ExportIcon from "./Icons/ExportIcon";
import SendUpIcon from "./Icons/SendUpIcon";
import UnpublishIcon from "./Icons/UnpublishIcon";
import NestedMenuItem from './NestedMenuItem';
import Toast from "./Toast";
import { isCollectionCard, isPromptCard } from "./useCardLike";
import useCardNavigate from "./useCardNavigate";

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

export default function DataRowAction({ data, viewMode, type }) {
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

  const { cardType } = data
  const isPromptRow = useMemo(() => isPromptCard(cardType || type), [cardType, type]);
  const isCollectionRow = useMemo(() => isCollectionCard(cardType || type), [cardType, type]);
  const isFromMyLibrary = viewMode === ViewMode.Owner;

  /** Export Actions Start*/
  const doExport = useExport({
    id: data?.id,
    name: data?.name,
    isCollection: isCollectionRow
  })
  const handleExportAlita = useCallback(async () => {
    await doExport({ isDial: false })();
    handleClose();
  }, [doExport, handleClose]);

  const handleExportDial = useCallback(async () => {
    await doExport({ isDial: true })();
    handleClose();
  }, [doExport, handleClose]);

  const exportMenu = useMemo(() => ({
    icon: <ExportIcon fontSize={'inherit'} />,
    label: 'Export',
    subMenu: [
      {
        onClick: handleExportAlita,
        label: '[Alita format]'
      },
      {
        onClick: handleExportDial,
        icon: <ExportIcon fontSize={'inherit'} />,
        label: '[DIAL format]'
      }
    ]
  }), [handleExportAlita, handleExportDial]);
  /** Export Actions End*/

  /** Prompt Actions start*/
  const [openDialog, setOpenDialog] = useState(false);
  const openAddToCollectionDialog = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]);
  const projectId = useProjectId();

  const [deletePrompt] = useDeletePromptMutation();
  const doDeletePrompt = useCallback(
    async () => {
      await deletePrompt({ projectId, promptId: data?.id });
    },
    [data?.id, deletePrompt, projectId],
  );

  const promptMenu = useMemo(() => {
    const list = viewMode === ViewMode.Moderator ? [exportMenu]: [{
      onClick: withClose(openAddToCollectionDialog),
      icon: <BookmarkIcon fontSize={'inherit'} />,
      label: 'Add To Collection'
    },
    exportMenu
    ]

    if (isFromMyLibrary) {
      list.push({
        icon: <DeleteIcon fontSize={'inherit'} />,
        label: 'Delete',
        confirmText: 'Are you sure you want to delete this prompt?',
        onConfirm: doDeletePrompt,
      });
    }
    return list;
  }, [doDeletePrompt, exportMenu, isFromMyLibrary, openAddToCollectionDialog, viewMode, withClose]);
  /** Prompt Actions end*/

  /**Collection Actions start*/
  const {
    onConfirmPublish: doPublishCollection,
    onConfirmUnpublish: doUnpublishCollection,
    onConfirmDelete: doDeleteCollection,
    confirmPublishText,
    confirmUnpublishText,
    confirmDeleteText,
    openToast,
    severity,
    message,
  } = useCollectionActions({ collection: data });

  const navigateToCollectionEdit = useCardNavigate({
    viewMode: ViewMode.Owner,
    id: data?.id,
    type: ContentType.MyLibraryCollectionsEdit,
    name: data?.name,
    replace: false
  });
  const collectionMenu = useMemo(() => {
    let list = []
    if (isFromMyLibrary) {
      const publishMenu = {
        icon: <SendUpIcon fontSize={'inherit'} />,
        label: 'Publish',
        confirmText: confirmPublishText,
        onConfirm: doPublishCollection,
      };
      const unpublishMenu = {
        icon: <UnpublishIcon fontSize={'inherit'} />,
        label: 'Unpublish',
        confirmText: confirmUnpublishText,
        onConfirm: doUnpublishCollection,
      };
      list.push(
        (data?.status === CollectionStatus.Published ? unpublishMenu : publishMenu),
        exportMenu,
        {
          onClick: navigateToCollectionEdit,
          icon: <EditIcon fontSize={'inherit'} />,
          label: 'Edit',
        },
        {
          onClick: handleClose,
          icon: <DeleteIcon fontSize={'inherit'} />,
          label: 'Delete',
          confirmText: confirmDeleteText,
          onConfirm: doDeleteCollection,
        },
      );
    } else {
      list = [exportMenu];
    }
    return list;
  }, [confirmDeleteText, confirmPublishText, confirmUnpublishText, data?.status, doDeleteCollection, doPublishCollection, doUnpublishCollection, exportMenu, handleClose, isFromMyLibrary, navigateToCollectionEdit]);
  /**Collection Actions End*/

  const nestedRootItemRef = useRef(null);
  const menuList = useMemo(() => {
    let list = []
    if (isPromptRow) {
      list = promptMenu
    } else if (isCollectionRow) {
      list = collectionMenu
    }

    return list.map(({ onClick, icon, label, subMenu, confirmText, onConfirm }, index) => {
      if (subMenu) {
        return <NestedMenuItem
          key={index}
          ref={nestedRootItemRef}
          leftIcon={<ExportIcon fontSize='inherit' />}
          label='Export'
          parentMenuOpen={open}
          MenuItemComponent={StyledMenuItem}
          onClick={handleClose}
        >
          {subMenu.map(({ onClick: onClickSub, label: subLabel }, indexSub) => {
            return <BasicMenuItem key={indexSub} label={subLabel} onClick={withClose(onClickSub)} />
          })}
        </NestedMenuItem>
      }
      if (confirmText) {
        return <ActionWithDialog
          closeMenu={handleClose}
          key={index}
          icon={icon}
          label={label}
          confirmText={confirmText}
          onConfirm={withClose(onConfirm)}
        />
      }

      return <BasicMenuItem key={index} icon={icon} label={label} onClick={withClose(onClick)} />
    })
  }, [open, collectionMenu, handleClose, isCollectionRow, isPromptRow, promptMenu, withClose])

  return (
    <div>
      <IconButton
        id={data?.id + '-action'}
        aria-label="more"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <DotsMenuIcon />
      </IconButton>
      <Menu
        id={data?.id + '-dots-menu'}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
        keepMounted
      >
        {menuList}
      </Menu>

      {
        isPromptRow && <AddToCollectionDialog open={openDialog} setOpen={setOpenDialog} prompt={data} />
      }
      <Toast
        open={openToast}
        severity={severity}
        message={message}
      />
    </div>
  );
}