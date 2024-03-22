import { useCallback, useState } from "react";

const ALL_MESSAGES = 'ALL_MESSAGES'

export default function useDeleteMessageAlert ({
  setChatHistory,
  chatInput,
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [messageIdToDelete, setMessageIdToDelete] = useState('');
  const onDeleteAnswer = useCallback(
    (id) => () => {
      setOpenAlert(true);
      setMessageIdToDelete(id);
      setAlertContent('The deleted message can\'t be restored. Are you sure to delete the message?');
    },
    [],
  );

  const onDeleteAll = useCallback(
    () => {
      setOpenAlert(true);
      setMessageIdToDelete(ALL_MESSAGES);
      setAlertContent('The deleted messages can\'t be restored. Are you sure to delete all the messages?');
    },
    [],
  );

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
      setMessageIdToDelete('');
    },
    [],
  );

  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
    },
    [chatInput, setChatHistory],
  );

  const onConfirmDelete = useCallback(
    () => {
      if (messageIdToDelete === ALL_MESSAGES) {
        onClearChat();
      } else {
        setChatHistory((prevMessages) => {
          return prevMessages.filter(message => message.id !== messageIdToDelete)
        });

      }
      onCloseAlert();
    },
    [messageIdToDelete, onClearChat, onCloseAlert, setChatHistory],
  );

  return {
    openAlert,
    alertContent,
    messageIdToDelete,
    setOpenAlert,
    setAlertContent,
    setMessageIdToDelete,
    onDeleteAnswer,
    onDeleteAll,
    onConfirmDelete,
    onCloseAlert
  }
}