import useSocket from "@/hooks/useSocket";
import { useSelectedProjectId } from "@/pages/hooks";
import { Box, Button } from "@mui/material";

export default function Notifications() {
  const selectedProjectId = useSelectedProjectId();
  const eventId = String(selectedProjectId);
  const { messages = [], sendMessage } = useSocket(eventId);
  return (
    <Box>
      Messages with eventId: {selectedProjectId}
      <Button
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => sendMessage(eventId, 'hello socket')}
      >
        Send Message
      </Button>
      {
        messages.map(msg => <Box key={msg}>{msg}</Box>)
      }
    </Box>
  );
}