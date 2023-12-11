import { Avatar, useTheme } from "@mui/material";

import { getInitials, stringToColor } from '@/common/utils';

export default function UserAvatar({ name, avatar, shiftPixels = 0, size = 20 }) {
  const theme = useTheme();
  const userName = name || 'Unknown User';
  const commonStyle = {
    padding: '0',
    width: size + 'px',
    height: size + 'px',
    transform: `translateX(-${shiftPixels}px)`,
    backgroundColor: theme.palette.background.icon.default,
  };

  const stringAvatarStyle = {
    ...commonStyle,
    backgroundColor: stringToColor(userName),
    color: 'white',
    fontSize: Math.ceil(size / 2) + 'px',
  };

  if (avatar) {
    return <Avatar style={commonStyle} src={avatar} alt={userName}/>;
  }
  return (
    <Avatar style={stringAvatarStyle} alt={userName}>
      {getInitials(userName)}
    </Avatar>

  );
}